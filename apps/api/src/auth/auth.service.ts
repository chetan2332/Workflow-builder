import { Injectable } from '@nestjs/common';
import { PrismaService } from '@n8n-project/database';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) {}

  syncUser(userId: string, email: string) {
    return this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId, email },
      update: { email },
    });
  }
}
