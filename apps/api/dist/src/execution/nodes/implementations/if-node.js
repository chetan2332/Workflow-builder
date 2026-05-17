"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IfNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class IfNode extends flow_node_1.FlowNode {
    route(item, config) {
        if (item === undefined) {
            throw new Error('No input data for IF node');
        }
        const result = this.evaluateCondition(config.code, item);
        return result
            ? { true: [item], false: [] }
            : { true: [], false: [item] };
    }
}
exports.IfNode = IfNode;
//# sourceMappingURL=if-node.js.map