"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CombineNode = void 0;
const flow_node_1 = require("../categories/flow-node");
class CombineNode extends flow_node_1.FlowNode {
    route(inputs, config) {
        if (config.waitForAll) {
            const expectedHandles = Object.keys(inputs);
            for (const handleId of expectedHandles) {
                if (!inputs[handleId] || inputs[handleId].length === 0) {
                    throw new Error(`Missing data for input: ${handleId}`);
                }
            }
        }
        let result;
        switch (config.strategy) {
            case 'mergeObjects':
                result = Object.assign({}, ...Object.values(inputs).map(arr => arr[0]));
                break;
            case 'concatArrays':
                result = [].concat(...Object.values(inputs).flat());
                break;
            case 'custom':
                result = this.executeCustomCode(config.customCode, inputs);
                break;
            default:
                throw new Error(`Unknown combine strategy: ${config.strategy}`);
        }
        return { out: [result] };
    }
    executeCustomCode(code, inputs) {
        try {
            const fn = new Function('inputs', code);
            return fn(inputs);
        }
        catch (error) {
            throw new Error(`Custom combine code failed: ${error.message}`);
        }
    }
}
exports.CombineNode = CombineNode;
//# sourceMappingURL=combine-node.js.map