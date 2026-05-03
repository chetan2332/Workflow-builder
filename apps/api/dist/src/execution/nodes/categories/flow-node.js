"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowNode = void 0;
const base_node_1 = require("../base/base-node");
class FlowNode extends base_node_1.BaseNode {
    async execute(ctx) {
        ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');
        this.validateInputHandles(ctx);
        const outputs = this.route(ctx.inputs, ctx.config);
        const totalItems = Object.values(outputs)
            .reduce((sum, arr) => sum + arr.length, 0);
        ctx.tracker.log(`${ctx.definition.label} routed to ${Object.keys(outputs).length} output(s)`, 'info');
        return {
            outputs,
            metadata: {
                itemsProcessed: totalItems
            }
        };
    }
    evaluateCondition(code, input) {
        try {
            const fn = new Function('input', `return (${code});`);
            return fn(input) === true;
        }
        catch (error) {
            throw new Error(`Condition evaluation failed: ${error.message}`);
        }
    }
    evaluateExpression(code, input) {
        try {
            const fn = new Function('input', `return (${code});`);
            return fn(input);
        }
        catch (error) {
            throw new Error(`Expression evaluation failed: ${error.message}`);
        }
    }
}
exports.FlowNode = FlowNode;
//# sourceMappingURL=flow-node.js.map