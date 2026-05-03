import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NodeTemplate } from '../../generated/prisma/client';

@Injectable()
export class TemplatesService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll(): Promise<NodeTemplate[]> {
    const cacheKey = 'templates:all';
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as NodeTemplate[];

    const templates = await this.prisma.nodeTemplate.findMany({
      where: { isActive: true },
      orderBy: { templateId: 'asc' },
    });

    await this.cacheManager.set(cacheKey, templates, 3600000); // 1 hour
    return templates;
  }

  async findOne(templateId: string): Promise<NodeTemplate | null> {
    const cacheKey = `templates:${templateId}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached as NodeTemplate;

    const template = await this.prisma.nodeTemplate.findFirst({
      where: { templateId, isActive: true },
      orderBy: { version: 'desc' },
    });

    if (template) {
      await this.cacheManager.set(cacheKey, template, 3600000);
    }

    return template;
  }

  async getMany(templateIds: string[]): Promise<NodeTemplate[]> {
    const results = await Promise.all(
      templateIds.map(id => this.findOne(id))
    );
    // Filter out nulls and return properly typed array
    return results.filter((t): t is NodeTemplate => t !== null);
  }

  async invalidateCache() {
    // Cache manager v7 doesn't have reset, need to clear manually
    await this.cacheManager.del('templates:all');
  }
}
