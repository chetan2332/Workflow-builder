"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowNode = void 0;
const base_node_1 = require("../base/base-node");
class FlowNode extends base_node_1.BaseNode {
    async execute(ctx) {
        ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');
        this.validateInputHandles(ctx);
        const items = ctx.inputs['in'] ?? [];
        const outputs = {};
        for (const item of items) {
            const itemOutputs = this.route(item, ctx.config);
            for (const [handleId, data] of Object.entries(itemOutputs)) {
                if (!outputs[handleId])
                    outputs[handleId] = [];
                outputs[handleId].push(...data);
            }
        }
        ctx.tracker.log(`${ctx.definition.label} routed ${items.length} item(s) to ${Object.keys(outputs).length} output(s)`, 'info');
        return {
            outputs,
            metadata: { itemsProcessed: items.length }
        };
    }
    evaluateCondition(code, input) {
        if (!code || !code.trim())
            return false;
        try {
            const fn = new Function('input', `return (${code});`);
            return fn(input) === true;
        }
        catch (error) {
            throw new Error(`Condition evaluation failed: ${error.message}`);
        }
    }
}
exports.FlowNode = FlowNode;
//# sourceMappingURL=flow-node.js.map