import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/save-workflow.dto';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    findAll(page?: string, limit?: string, status?: string): Promise<{
        workflows: {
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            status: import("../../generated/prisma/enums").WorkflowStatus;
            _count: {
                nodes: number;
                edges: number;
            };
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: string): Promise<{
        nodes: {
            template: {
                id: string;
                templateId: string;
                version: string;
                name: string;
                description: string | null;
                nodeType: import("../../generated/prisma/enums").NodeType;
                shape: import("../../generated/prisma/enums").NodeShape;
                handlesConfig: import("@prisma/client/runtime/client").JsonValue;
                actionConfig: import("@prisma/client/runtime/client").JsonValue | null;
                dynamicHandles: import("@prisma/client/runtime/client").JsonValue | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | undefined;
            id: string;
            templateId: string;
            templateVersion: string;
            label: string | null;
            positionX: number;
            positionY: number;
            actionState: import("@prisma/client/runtime/client").JsonValue;
        }[];
        edges: {
            id: string;
            sourceNodeId: string;
            targetNodeId: string;
            sourceHandle: string | null;
            targetHandle: string | null;
        }[];
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/enums").WorkflowStatus;
    } | null>;
    create(createWorkflowDto: CreateWorkflowDto): import("../../generated/prisma/models").Prisma__WorkflowClient<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/enums").WorkflowStatus;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<{
        nodes: {
            template: {
                id: string;
                templateId: string;
                version: string;
                name: string;
                description: string | null;
                nodeType: import("../../generated/prisma/enums").NodeType;
                shape: import("../../generated/prisma/enums").NodeShape;
                handlesConfig: import("@prisma/client/runtime/client").JsonValue;
                actionConfig: import("@prisma/client/runtime/client").JsonValue | null;
                dynamicHandles: import("@prisma/client/runtime/client").JsonValue | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            } | undefined;
            id: string;
            templateId: string;
            templateVersion: string;
            label: string | null;
            positionX: number;
            positionY: number;
            actionState: import("@prisma/client/runtime/client").JsonValue;
        }[];
        edges: {
            id: string;
            sourceNodeId: string;
            targetNodeId: string;
            sourceHandle: string | null;
            targetHandle: string | null;
        }[];
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/enums").WorkflowStatus;
    } | null>;
    delete(id: string): import("../../generated/prisma/models").Prisma__WorkflowClient<{
        id: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
        status: import("../../generated/prisma/enums").WorkflowStatus;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
