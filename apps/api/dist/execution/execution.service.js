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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
const registry_1 = require("./nodes/registry");
let ExecutionService = class ExecutionService {
    http;
    engineUrl = process.env.EXECUTION_ENGINE_URL ?? 'http://localhost:3001';
    constructor(http) {
        this.http = http;
    }
    async executeNode(request) {
        const { nodeId, type, version, config, inputs } = request;
        try {
            const { data } = await (0, rxjs_1.firstValueFrom)(this.http.post(`${this.engineUrl}/api/execution/node/${nodeId}`, { nodeId, type, version, config, inputs }));
            return data;
        }
        catch (error) {
            const status = error.response?.status;
            const body = error.response?.data;
            if (status === 400) {
                throw new common_1.BadRequestException(body);
            }
            throw new common_1.InternalServerErrorException(body ?? {
                success: false,
                error: { message: error.message, code: 'EXECUTION_ENGINE_ERROR' }
            });
        }
    }
    async getNodeDefinitions() {
        const definitions = (0, registry_1.getAllNodeDefinitions)();
        return { nodes: definitions, count: definitions.length };
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], ExecutionService);
//# sourceMappingURL=execution.service.js.map