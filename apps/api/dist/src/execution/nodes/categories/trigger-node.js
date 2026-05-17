"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerNode = void 0;
const base_node_1 = require("../base/base-node");
const shared_1 = require("@n8n-project/shared");
class TriggerNode extends base_node_1.BaseNode {
    async execute(ctx) {
        ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');
        const payload = ctx.config.input?.payload ?? {};
        if (ctx.config.input?.schema) {
            ctx.tracker.log('Validating payload against input schema', 'info');
            const validation = (0, shared_1.validateData)(payload, ctx.config.input.schema);
            if (!validation.valid) {
                throw new Error(`Schema validation failed: ${JSON.stringify(validation.errors)}`);
            }
        }
        ctx.tracker.log(`${ctx.definition.label} completed successfully`, 'info');
        const outputHandleId = ctx.definition.outputHandles[0].id;
        return {
            outputs: { [outputHandleId]: [payload] },
            metadata: { itemsProcessed: payload.length }
        };
    }
}
exports.TriggerNode = TriggerNode;
//# sourceMappingURL=trigger-node.js.map