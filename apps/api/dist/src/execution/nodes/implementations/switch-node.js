"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class SwitchNode extends flow_node_1.FlowNode {
    route(item, config) {
        if (item === undefined) {
            throw new Error('No input data for SWITCH node');
        }
        const cases = config.cases ?? [];
        for (let i = 0; i < cases.length; i++) {
            if (this.evaluateCondition(cases[i].condition, item)) {
                return { [`case-${i}`]: [item] };
            }
        }
        return { default: [item] };
    }
}
exports.SwitchNode = SwitchNode;
//# sourceMappingURL=switch-node.js.map