import { PrismaService } from '@n8n-project/database';
export declare class AuthService {
    private prisma;
    constructor(prisma: PrismaService);
    syncUser(userId: string, email: string): import("@n8n-project/database/dist/generated/prisma/models").Prisma__UserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("@n8n-project/database/dist/generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
