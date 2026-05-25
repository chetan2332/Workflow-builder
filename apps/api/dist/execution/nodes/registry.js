"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeRegistry = void 0;
exports.getAllNodeDefinitions = getAllNodeDefinitions;
exports.getNodeDefinition = getNodeDefinition;
exports.getNodeClass = getNodeClass;
exports.hasNodeType = hasNodeType;
const shared_1 = require("@n8n-project/shared");
const start_node_1 = require("./implementations/start-node");
const http_node_1 = require("./implementations/http-node");
const llm_node_1 = require("./implementations/llm-node");
const function_node_1 = require("./implementations/function-node");
const if_node_1 = require("./implementations/if-node");
const switch_node_1 = require("./implementations/switch-node");
const condition_node_1 = require("./implementations/condition-node");
const combine_node_1 = require("./implementations/combine-node");
exports.NodeRegistry = {
    'trigger.start': {
        1: {
            definition: shared_1.startDefinition,
            class: start_node_1.StartNode
        }
    },
    'code.http': {
        1: {
            definition: shared_1.httpDefinition,
            class: http_node_1.HttpNode
        }
    },
    'code.llm': {
        1: {
            definition: shared_1.llmDefinition,
            class: llm_node_1.LlmNode
        }
    },
    'code.function': {
        1: {
            definition: shared_1.functionDefinition,
            class: function_node_1.FunctionNode
        }
    },
    'flow.if': {
        1: {
            definition: shared_1.ifDefinition,
            class: if_node_1.IfNode
        }
    },
    'flow.switch': {
        1: {
            definition: shared_1.switchDefinition,
            class: switch_node_1.SwitchNode
        }
    },
    'flow.condition': {
        1: {
            definition: shared_1.conditionDefinition,
            class: condition_node_1.ConditionNode
        }
    },
    'flow.combine': {
        1: {
            definition: shared_1.combineDefinition,
            class: combine_node_1.CombineNode
        }
    }
};
function getAllNodeDefinitions() {
    return Object.values(exports.NodeRegistry)
        .flatMap(versions => Object.values(versions))
        .map(entry => entry.definition);
}
function getNodeDefinition(type, version) {
    return exports.NodeRegistry[type]?.[version]?.definition;
}
function getNodeClass(type, version) {
    return exports.NodeRegistry[type]?.[version]?.class;
}
function hasNodeType(type, version = 1) {
    return !!exports.NodeRegistry[type]?.[version];
}
//# sourceMappingURL=registry.js.map