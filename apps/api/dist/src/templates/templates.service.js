"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplatesService = void 0;
const common_1 = require("@nestjs/common");
const cache_manager_1 = require("@nestjs/cache-manager");
const prisma_service_1 = require("../prisma/prisma.service");
let TemplatesService = class TemplatesService {
    prisma;
    cacheManager;
    constructor(prisma, cacheManager) {
        this.prisma = prisma;
        this.cacheManager = cacheManager;
    }
    async findAll() {
        const cacheKey = 'templates:all';
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const templates = await this.prisma.nodeTemplate.findMany({
            where: { isActive: true },
            orderBy: { templateId: 'asc' },
        });
        await this.cacheManager.set(cacheKey, templates, 3600000);
        return templates;
    }
    async findOne(templateId) {
        const cacheKey = `templates:${templateId}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached)
            return cached;
        const template = await this.prisma.nodeTemplate.findFirst({
            where: { templateId, isActive: true },
            orderBy: { version: 'desc' },
        });
        if (template) {
            await this.cacheManager.set(cacheKey, template, 3600000);
        }
        return template;
    }
    async getMany(templateIds) {
        const results = await Promise.all(templateIds.map(id => this.findOne(id)));
        return results.filter((t) => t !== null);
    }
    async invalidateCache() {
        await this.cacheManager.del('templates:all');
    }
};
exports.TemplatesService = TemplatesService;
exports.TemplatesService = TemplatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(cache_manager_1.CACHE_MANAGER)),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, Object])
], TemplatesService);
//# sourceMappingURL=templates.service.js.map