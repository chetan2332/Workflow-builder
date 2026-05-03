"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class IfNode extends flow_node_1.FlowNode {
    route(inputs, config) {
        const inputData = inputs.in?.[0];
        if (inputData === undefined) {
            throw new Error('No input data for IF node');
        }
        const result = this.evaluateCondition(config.code, inputData);
        return result
            ? { true: [inputData], false: [] }
            : { true: [], false: [inputData] };
    }
}
exports.IfNode = IfNode;
//# sourceMappingURL=if-node.js.map