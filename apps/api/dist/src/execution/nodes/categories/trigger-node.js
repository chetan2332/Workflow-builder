"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerNode = void 0;
const base_node_1 = require("../base/base-node");
const shared_1 = require("@n8n-project/shared");
class TriggerNode extends base_node_1.BaseNode {
    async execute(ctx) {
        ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');
        this.validateInputHandles(ctx);
        const inputs = this.inputs[ctx.definition.inputHandles[0].id];
        if (!inputs || inputs.length === 0) {
            throw new Error('No input data received on trigger node');
        }
        for (const input of inputs) {
            const payload = input;
            if (ctx.config.enforceSchema && ctx.config.inputSchema) {
                ctx.tracker.log('Validating payload against input schema', 'info');
                const validation = (0, shared_1.validateData)(payload, ctx.config.inputSchema);
                if (!validation.valid) {
                    throw new Error(`Schema validation failed: ${JSON.stringify(validation.errors)}`);
                }
            }
        }
        ctx.tracker.log(`${ctx.definition.label} completed successfully`, 'info');
        const outputHandleId = ctx.definition.outputHandles[0].id;
        return {
            outputs: { [outputHandleId]: inputs },
            metadata: {
                itemsProcessed: inputs.length
            }
        };
    }
}
exports.TriggerNode = TriggerNode;
//# sourceMappingURL=trigger-node.js.map