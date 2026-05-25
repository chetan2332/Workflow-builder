import { PrismaService } from '@n8n-project/database';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId: string, query?: {
        page?: number;
        limit?: number;
        status?: string;
    }): Promise<{
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
    findOne(id: string, userId: string): Promise<({
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
    create(dto: CreateWorkflowDto, userId: string): import("@n8n-project/database/dist/generated/prisma/models").Prisma__WorkflowClient<{
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
    update(id: string, dto: UpdateWorkflowDto, userId: string): Promise<({
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
    delete(id: string, userId: string): import("@n8n-project/database/dist/generated/prisma/models").Prisma__WorkflowClient<{
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
