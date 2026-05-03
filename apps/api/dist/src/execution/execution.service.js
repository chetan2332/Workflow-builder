"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionService = void 0;
const common_1 = require("@nestjs/common");
const factory_1 = require("./nodes/factory");
const registry_1 = require("./nodes/registry");
const resource_tracker_1 = require("./utils/resource-tracker");
let ExecutionService = class ExecutionService {
    async executeNode(request) {
        const { nodeId, type, version, config, inputs } = request;
        try {
            const node = factory_1.NodeFactory.create({
                id: nodeId,
                type,
                version,
                config,
                inputs
            });
            const tracker = new resource_tracker_1.ResourceTracker();
            const ctx = {
                nodeId: node.id,
                definition: node.definition,
                inputs,
                config,
                tracker
            };
            const result = await node.execute(ctx);
            return {
                success: true,
                result
            };
        }
        catch (error) {
            if (error.message.includes('validation') || error.message.includes('Unknown node type')) {
                throw new common_1.BadRequestException({
                    success: false,
                    error: {
                        message: error.message,
                        code: 'VALIDATION_ERROR'
                    }
                });
            }
            throw new common_1.InternalServerErrorException({
                success: false,
                error: {
                    message: error.message,
                    code: error.code || 'EXECUTION_ERROR',
                    stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
                }
            });
        }
    }
    async getNodeDefinitions() {
        const definitions = (0, registry_1.getAllNodeDefinitions)();
        return {
            nodes: definitions,
            count: definitions.length
        };
    }
};
exports.ExecutionService = ExecutionService;
exports.ExecutionService = ExecutionService = __decorate([
    (0, common_1.Injectable)()
], ExecutionService);
//# sourceMappingURL=execution.service.js.map