import { AuthService } from './auth.service';
import { type AuthUser } from './current-user.decorator';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    syncUser(user: AuthUser): import("@n8n-project/database/dist/generated/prisma/models").Prisma__UserClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        email: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("@n8n-project/database/dist/generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
}
