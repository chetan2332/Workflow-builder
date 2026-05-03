import { TemplatesService } from './templates.service';
export declare class TemplatesController {
    private readonly templatesService;
    constructor(templatesService: TemplatesService);
    findAll(): Promise<{
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
    }[]>;
    findOne(id: string): Promise<{
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
    } | null>;
}
