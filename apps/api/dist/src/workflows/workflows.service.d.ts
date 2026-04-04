import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkflowDto } from './dto/create-workflow.dto';
import { UpdateWorkflowDto } from './dto/update-workflow.dto';
export declare class WorkflowsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: string;
        name: string;
        description: string | null;
        status: import("../../generated/prisma/enums").WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): import("../../generated/prisma/models").Prisma__WorkflowClient<({
        nodes: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workflowId: string;
            type: import("../../generated/prisma/enums").NodeType;
            label: string | null;
            positionX: number;
            positionY: number;
            config: import("@prisma/client/runtime/client").JsonValue;
        }[];
        edges: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            workflowId: string;
            sourceNodeId: string;
            targetNodeId: string;
            sourceHandle: string | null;
            targetHandle: string | null;
            meta: import("@prisma/client/runtime/client").JsonValue | null;
        }[];
    } & {
        id: string;
        name: string;
        description: string | null;
        status: import("../../generated/prisma/enums").WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    create(dto: CreateWorkflowDto): import("../../generated/prisma/models").Prisma__WorkflowClient<{
        id: string;
        name: string;
        description: string | null;
        status: import("../../generated/prisma/enums").WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    update(dto: UpdateWorkflowDto): import("../../generated/prisma/models").Prisma__WorkflowClient<{
        id: string;
        name: string;
        description: string | null;
        status: import("../../generated/prisma/enums").WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    delete(id: string): import("../../generated/prisma/models").Prisma__WorkflowClient<{
        id: string;
        name: string;
        description: string | null;
        status: import("../../generated/prisma/enums").WorkflowStatus;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
