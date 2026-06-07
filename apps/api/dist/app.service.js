"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = exports.NodeRegistry = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("@n8n-project/shared");
exports.NodeRegistry = {
    'trigger.start': {
        1: {
            definition: shared_1.startDefinition
        }
    },
    'code.http': {
        1: {
            definition: shared_1.httpDefinition
        }
    },
    'code.llm': {
        1: {
            definition: shared_1.llmDefinition
        }
    },
    'code.function': {
        1: {
            definition: shared_1.functionDefinition
        }
    },
    'flow.if': {
        1: {
            definition: shared_1.ifDefinition
        }
    },
    'flow.switch': {
        1: {
            definition: shared_1.switchDefinition
        }
    },
    'flow.condition': {
        1: {
            definition: shared_1.conditionDefinition
        }
    },
    'flow.combine': {
        1: {
            definition: shared_1.combineDefinition
        }
    }
};
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
    getNodes() {
        return Object.values(exports.NodeRegistry).flatMap((versions) => Object.values(versions).map((entry) => entry.definition));
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);
//# sourceMappingURL=app.service.js.map