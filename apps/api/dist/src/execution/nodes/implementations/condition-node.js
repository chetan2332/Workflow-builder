"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class ConditionNode extends flow_node_1.FlowNode {
    route(item, config) {
        if (item === undefined) {
            throw new Error('No input data for CONDITION node');
        }
        const conditions = config.conditions ?? [];
        const outputs = {};
        for (let i = 0; i < conditions.length; i++) {
            if (this.evaluateCondition(conditions[i].condition, item)) {
                outputs[`case-${i}`] = [item];
            }
        }
        return outputs;
    }
}
exports.ConditionNode = ConditionNode;
//# sourceMappingURL=condition-node.js.map