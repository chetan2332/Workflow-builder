import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NodeTemplate } from '../../generated/prisma/client';
export declare class TemplatesService {
    private prisma;
    private cacheManager;
    constructor(prisma: PrismaService, cacheManager: Cache);
    findAll(): Promise<NodeTemplate[]>;
    findOne(templateId: string): Promise<NodeTemplate | null>;
    getMany(templateIds: string[]): Promise<NodeTemplate[]>;
    invalidateCache(): Promise<void>;
}
