"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class ConditionNode extends flow_node_1.FlowNode {
    route(inputs, config) {
        const inputData = inputs.in?.[0];
        if (inputData === undefined) {
            throw new Error('No input data for CONDITION node');
        }
        const outputs = {};
        for (let i = 0; i < config.outputHandleCount; i++) {
            const condition = this.getConditionForOutput(i, config);
            const result = this.evaluateCondition(condition, inputData);
            if (result === true) {
                const outputId = `out${i + 1}`;
                outputs[outputId] = [inputData];
            }
        }
        return outputs;
    }
    getConditionForOutput(index, config) {
        return config.conditions?.[index] || 'true';
    }
}
exports.ConditionNode = ConditionNode;
//# sourceMappingURL=condition-node.js.map