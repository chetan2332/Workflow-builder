"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const templates_service_1 = require("../templates/templates.service");
let WorkflowsService = class WorkflowsService {
    prisma;
    templatesService;
    constructor(prisma, templatesService) {
        this.prisma = prisma;
        this.templatesService = templatesService;
    }
    async findAll(query) {
        const page = query?.page || 1;
        const limit = Math.min(query?.limit || 20, 100);
        const skip = (page - 1) * limit;
        const where = query?.status ? { status: query.status } : {};
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
    async findOne(id) {
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
        const templateIds = Array.from(new Set(workflow.nodes.map(n => n.templateId)));
        const validTemplates = await this.templatesService.getMany(templateIds);
        const templateMap = new Map(validTemplates.map(t => [t.templateId, t]));
        const nodesWithTemplates = workflow.nodes.map(node => ({
            ...node,
            template: templateMap.get(node.templateId),
        }));
        return {
            ...workflow,
            nodes: nodesWithTemplates,
        };
    }
    create(dto) {
        return this.prisma.workflow.create({
            data: {
                name: dto.name,
                description: dto.description
            }
        });
    }
    async update(id, dto) {
        const templateIds = Array.from(new Set(dto.nodes.map(n => n.templateId)));
        const validTemplates = await this.templatesService.getMany(templateIds);
        const missingTemplates = templateIds.filter(tid => !validTemplates.some(t => t.templateId === tid));
        if (missingTemplates.length > 0) {
            throw new common_1.BadRequestException(`Unknown templates: ${missingTemplates.join(', ')}`);
        }
        const nodeIds = new Set(dto.nodes.map(n => n.id));
        const invalidEdges = dto.edges.filter(e => !nodeIds.has(e.sourceNodeId) || !nodeIds.has(e.targetNodeId));
        if (invalidEdges.length > 0) {
            throw new common_1.BadRequestException('Edges reference non-existent nodes');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.workflow.update({
                where: { id },
                data: {
                    name: dto.name,
                    description: dto.description,
                    status: dto.status,
                },
            });
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
            const nodesToDelete = Array.from(existingNodeIds).filter(nid => !incomingNodeIds.has(nid));
            const nodesToCreate = dto.nodes.filter(n => !existingNodeIds.has(n.id));
            const nodesToUpdate = dto.nodes.filter(n => existingNodeIds.has(n.id));
            const edgesToDelete = Array.from(existingEdgeIds).filter(eid => !incomingEdgeIds.has(eid));
            const edgesToCreate = dto.edges.filter(e => !existingEdgeIds.has(e.id));
            const edgesToUpdate = dto.edges.filter(e => existingEdgeIds.has(e.id));
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
            if (nodesToUpdate.length > 0) {
                await Promise.all(nodesToUpdate.map(n => tx.node.update({
                    where: { id: n.id },
                    data: {
                        label: n.label,
                        positionX: n.positionX,
                        positionY: n.positionY,
                        actionState: n.actionState,
                    },
                })));
            }
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
            if (edgesToUpdate.length > 0) {
                await Promise.all(edgesToUpdate.map(e => tx.edge.update({
                    where: { id: e.id },
                    data: {
                        sourceHandle: e.sourceHandle,
                        targetHandle: e.targetHandle,
                    },
                })));
            }
            return this.findOne(id);
        }, {
            maxWait: 5000,
            timeout: 10000,
        });
    }
    delete(id) {
        return this.prisma.workflow.delete({
            where: { id }
        });
    }
};
exports.WorkflowsService = WorkflowsService;
exports.WorkflowsService = WorkflowsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        templates_service_1.TemplatesService])
], WorkflowsService);
//# sourceMappingURL=workflows.service.js.map