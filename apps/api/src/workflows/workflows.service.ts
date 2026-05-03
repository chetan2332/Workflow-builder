import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TemplatesService } from '../templates/templates.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/save-workflow.dto';

@Injectable()
export class WorkflowsService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly templatesService: TemplatesService,
    ) {}

    async findAll(query?: { page?: number; limit?: number; status?: string }) {
        const page = query?.page || 1;
        const limit = Math.min(query?.limit || 20, 100);
        const skip = (page - 1) * limit;

        const where = query?.status ? { status: query.status as any } : {};

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

    async findOne(id: string) {
        const workflow = await this.prisma.workflow.findUnique({
            where: { id },
            include: {
                nodes: {
                    select: {
                        id: true,
                        templateId: true,
                        templateVersion: true,
                        label: true,
                        positionX: true,
                        positionY: true,
                        actionState: true,
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

        if (!workflow) {
            return null;
        }

        // Enrich nodes with full template data from cache
        const templateIds = Array.from(new Set(workflow.nodes.map(n => n.templateId)));
        const validTemplates = await this.templatesService.getMany(templateIds);

        // Create a map for fast lookup
        const templateMap = new Map(validTemplates.map(t => [t.templateId, t]));

        // Attach template to each node
        const nodesWithTemplates = workflow.nodes.map(node => ({
            ...node,
            template: templateMap.get(node.templateId),
        }));

        return {
            ...workflow,
            nodes: nodesWithTemplates,
        };
    }

    create(dto: CreateWorkflowDto) {
        return this.prisma.workflow.create({
            data: {
                name: dto.name,
                description: dto.description
            }
        });
    }

    async update(id: string, dto: UpdateWorkflowDto) {
        // Validate templates exist
        const templateIds = Array.from(new Set(dto.nodes.map(n => n.templateId)));
        const validTemplates = await this.templatesService.getMany(templateIds);

        const missingTemplates = templateIds.filter(
            tid => !validTemplates.some(t => t.templateId === tid)
        );

        if (missingTemplates.length > 0) {
            throw new BadRequestException(
                `Unknown templates: ${missingTemplates.join(', ')}`
            );
        }

        // Validate edges reference valid nodes
        const nodeIds = new Set(dto.nodes.map(n => n.id));
        const invalidEdges = dto.edges.filter(
            e => !nodeIds.has(e.sourceNodeId) || !nodeIds.has(e.targetNodeId)
        );

        if (invalidEdges.length > 0) {
            throw new BadRequestException('Edges reference non-existent nodes');
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
                        templateId: n.templateId,
                        templateVersion: '1.0.0',
                        label: n.label,
                        positionX: n.positionX,
                        positionY: n.positionY,
                        actionState: n.actionState,
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
                                label: n.label,
                                positionX: n.positionX,
                                positionY: n.positionY,
                                actionState: n.actionState,
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
            return this.findOne(id);
        }, {
            maxWait: 5000,
            timeout: 10000,
        });
    }

    delete(id: string) {
        return this.prisma.workflow.delete({
            where: { id }
        });
    }
}
