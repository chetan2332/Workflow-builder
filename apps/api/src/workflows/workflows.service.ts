import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@n8n-project/database';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';

@Injectable()
export class WorkflowsService {

    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async findAll(userId: string, query?: { page?: number; limit?: number; status?: string }) {
        const page = query?.page || 1;
        const limit = Math.min(query?.limit || 20, 100);
        const skip = (page - 1) * limit;

        const where = {
            userId,
            ...(query?.status ? { status: query.status as any } : {}),
        };

        const [workflows, total] = await Promise.all([
            this.prisma.workflow.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: { nodes: true, edges: true },
                    },
                },
                orderBy: { updatedAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.workflow.count({ where }),
        ]);

        return { workflows, total, page, pageSize: limit };
    }

    async findOne(id: string, userId: string) {
        return this.prisma.workflow.findUnique({
            where: { id, userId },
            include: {
                nodes: {
                    select: {
                        id: true,
                        type: true,
                        version: true,
                        category: true,
                        positionX: true,
                        positionY: true,
                        configValues: true,
                        label: true,
                        description: true,
                        inputHandles: true,
                        outputHandles: true,
                        configHandles: true,
                    },
                },
                edges: {
                    select: {
                        id: true,
                        sourceNodeId: true,
                        targetNodeId: true,
                        sourceHandle: true,
                        targetHandle: true,
                    },
                },
            },
        });
    }

    create(dto: CreateWorkflowDto, userId: string) {
        return this.prisma.workflow.create({
            data: {
                userId,
                name: dto.name,
                description: dto.description
            }
        });
    }

    async update(id: string, dto: UpdateWorkflowDto, userId: string) {
        // Validate edges reference valid nodes
        const nodeIds = new Set(dto.nodes.map(n => n.id));
        const invalidEdges = dto.edges.filter(
            e => !nodeIds.has(e.sourceNodeId) || !nodeIds.has(e.targetNodeId)
        );

        if (invalidEdges.length > 0) {
            throw new BadRequestException('Edges reference non-existent nodes');
        }

        // Validate Function node code returns an object (lightweight static check)
        for (const node of dto.nodes) {
            if (node.type === 'code.function') {
                const code = (node.configValues as any)?.code;
                this.assertFunctionReturnsObject(code, node.label ?? node.id);
            }
        }

        // Execute transaction
        return this.prisma.$transaction(async (tx) => {
            // Update workflow metadata
            await tx.workflow.update({
                where: { id },
                data: {
                    name: dto.name,
                    description: dto.description,
                    status: dto.status as any,
                },
            });

            // Fetch existing entities
            const [existingNodes, existingEdges] = await Promise.all([
                tx.node.findMany({
                    where: { workflowId: id },
                    select: { id: true },
                }),
                tx.edge.findMany({
                    where: { workflowId: id },
                    select: { id: true },
                }),
            ]);

            const existingNodeIds = new Set(existingNodes.map(n => n.id));
            const existingEdgeIds = new Set(existingEdges.map(e => e.id));

            const incomingNodeIds = new Set(dto.nodes.map(n => n.id));
            const incomingEdgeIds = new Set(dto.edges.map(e => e.id));

            // Calculate diffs
            const nodesToDelete = Array.from(existingNodeIds).filter(
                nid => !incomingNodeIds.has(nid)
            );
            const nodesToCreate = dto.nodes.filter(n => !existingNodeIds.has(n.id));
            const nodesToUpdate = dto.nodes.filter(n => existingNodeIds.has(n.id));

            const edgesToDelete = Array.from(existingEdgeIds).filter(
                eid => !incomingEdgeIds.has(eid)
            );
            const edgesToCreate = dto.edges.filter(e => !existingEdgeIds.has(e.id));
            const edgesToUpdate = dto.edges.filter(e => existingEdgeIds.has(e.id));

            // Delete removed entities
            if (nodesToDelete.length > 0) {
                await tx.node.deleteMany({
                    where: { id: { in: nodesToDelete } },
                });
            }

            if (edgesToDelete.length > 0) {
                await tx.edge.deleteMany({
                    where: { id: { in: edgesToDelete } },
                });
            }

            // Create new nodes
            if (nodesToCreate.length > 0) {
                await tx.node.createMany({
                    data: nodesToCreate.map(n => ({
                        id: n.id,
                        workflowId: id,
                        type: n.type,
                        version: n.version,
                        category: n.category as any,
                        positionX: n.positionX,
                        positionY: n.positionY,
                        configValues: n.configValues as any,
                        label: n.label,
                        description: n.description,
                        inputHandles: n.inputHandles as any,
                        outputHandles: n.outputHandles as any,
                        configHandles: n.configHandles as any,
                    })),
                });
            }

            // Update existing nodes
            if (nodesToUpdate.length > 0) {
                await Promise.all(
                    nodesToUpdate.map(n =>
                        tx.node.update({
                            where: { id: n.id },
                            data: {
                                type: n.type,
                                version: n.version,
                                category: n.category as any,
                                positionX: n.positionX,
                                positionY: n.positionY,
                                configValues: n.configValues as any,
                                label: n.label,
                                description: n.description,
                                inputHandles: n.inputHandles as any,
                                outputHandles: n.outputHandles as any,
                                configHandles: n.configHandles as any,
                            },
                        })
                    )
                );
            }

            // Create new edges
            if (edgesToCreate.length > 0) {
                await tx.edge.createMany({
                    data: edgesToCreate.map(e => ({
                        id: e.id,
                        workflowId: id,
                        sourceNodeId: e.sourceNodeId,
                        targetNodeId: e.targetNodeId,
                        sourceHandle: e.sourceHandle,
                        targetHandle: e.targetHandle,
                    })),
                });
            }

            // Update existing edges
            if (edgesToUpdate.length > 0) {
                await Promise.all(
                    edgesToUpdate.map(e =>
                        tx.edge.update({
                            where: { id: e.id },
                            data: {
                                sourceHandle: e.sourceHandle,
                                targetHandle: e.targetHandle,
                            },
                        })
                    )
                );
            }

            // Return updated workflow
            return this.findOne(id, userId);
        }, {
            maxWait: 5000,
            timeout: 10000,
        });
    }

    /**
     * Lightweight static check that a Function node's code returns an object.
     * Conservative: only rejects obvious violations (missing return, or a return
     * of a primitive/array literal). Dynamic cases fall through to the runtime guard.
     */
    private assertFunctionReturnsObject(code: unknown, label: string): void {
        if (typeof code !== 'string' || !code.trim()) {
            throw new BadRequestException(`Function node "${label}": code is required`);
        }

        // Strip line and block comments before scanning
        const stripped = code
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\/\/[^\n]*/g, '');

        if (!/\breturn\b/.test(stripped)) {
            throw new BadRequestException(`Function node "${label}": code must return an object`);
        }

        // Flag obvious non-object return literals: return <number|string|bool|null|array>
        const badReturn = /\breturn\s+(-?\d|['"`]|true\b|false\b|null\b|\[)/;
        if (badReturn.test(stripped)) {
            throw new BadRequestException(`Function node "${label}": must return an object, e.g. return { key: value }`);
        }
    }

    delete(id: string, userId: string) {
        return this.prisma.workflow.delete({
            where: { id, userId }
        });
    }
}
