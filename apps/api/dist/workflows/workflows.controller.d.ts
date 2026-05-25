import { WorkflowsService } from './workflows.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
import { type AuthUser } from '../auth/current-user.decorator';
export declare class WorkflowsController {
    private readonly workflowsService;
    constructor(workflowsService: WorkflowsService);
    findAll(user: AuthUser, page?: string, limit?: string, status?: string): Promise<{
        workflows: {
            status: import("@n8n-project/database").WorkflowStatus;
            id: string;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
            _count: {
                nodes: number;
                edges: number;
            };
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(user: AuthUser, id: string): Promise<({
        nodes: {
            id: string;
            description: string;
            type: string;
            version: number;
            category: string;
            positionX: number;
            positionY: number;
            configValues: import("@prisma/client/runtime/client").JsonValue;
            label: string;
            inputHandles: import("@prisma/client/runtime/client").JsonValue;
            outputHandles: import("@prisma/client/runtime/client").JsonValue;
            configHandles: import("@prisma/client/runtime/client").JsonValue;
        }[];
        edges: {
            id: string;
            sourceNodeId: string;
            targetNodeId: string;
            sourceHandle: string | null;
            targetHandle: string | null;
        }[];
    } & {
        status: import("@n8n-project/database").WorkflowStatus;
        id: string;
        userId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    create(user: AuthUser, createWorkflowDto: CreateWorkflowDto): import("@n8n-project/database/dist/generated/prisma/models").Prisma__WorkflowClient<{
        status: import("@n8n-project/database").WorkflowStatus;
        id: string;
        userId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("@n8n-project/database/dist/generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(user: AuthUser, id: string, updateWorkflowDto: UpdateWorkflowDto): Promise<({
        nodes: {
            id: string;
            description: string;
            type: string;
            version: number;
            category: string;
            positionX: number;
            positionY: number;
            configValues: import("@prisma/client/runtime/client").JsonValue;
            label: string;
            inputHandles: import("@prisma/client/runtime/client").JsonValue;
            outputHandles: import("@prisma/client/runtime/client").JsonValue;
            configHandles: import("@prisma/client/runtime/client").JsonValue;
        }[];
        edges: {
            id: string;
            sourceNodeId: string;
            targetNodeId: string;
            sourceHandle: string | null;
            targetHandle: string | null;
        }[];
    } & {
        status: import("@n8n-project/database").WorkflowStatus;
        id: string;
        userId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    delete(user: AuthUser, id: string): import("@n8n-project/database/dist/generated/prisma/models").Prisma__WorkflowClient<{
        status: import("@n8n-project/database").WorkflowStatus;
        id: string;
        userId: string;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("@n8n-project/database/dist/generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
