"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwitchNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class SwitchNode extends flow_node_1.FlowNode {
    route(inputs, config) {
        const inputData = inputs.in?.[0];
        if (inputData === undefined) {
            throw new Error('No input data for SWITCH node');
        }
        const switchValue = this.evaluateExpression(config.code, inputData);
        let matchedOutput = null;
        for (let i = 0; i < config.outputHandleCount; i++) {
            const caseValue = config.outputLabels?.[i];
            if (caseValue === switchValue) {
                matchedOutput = `case${i + 1}`;
                break;
            }
        }
        if (!matchedOutput) {
            if (config.enableDefault) {
                matchedOutput = 'default';
            }
            else {
                return {};
            }
        }
        return { [matchedOutput]: [inputData] };
    }
}
exports.SwitchNode = SwitchNode;
//# sourceMappingURL=switch-node.js.map