import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
import { validateData } from '@n8n-project/shared';

/**
 * Base class for all TRIGGER category nodes
 *
 * Behavior:
 * - Pass-through: Take payload from config, output as-is
 * - Optional schema validation if enforceSchema: true
 * - Single output handle: 'out'
 */
export abstract class TriggerNode extends BaseNode {
  async execute(ctx: ExecutionContext): Promise<NodeOutput> {
    // Use definition for logging
    ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');

    // Validate input handles
    this.validateInputHandles(ctx);

    const inputs = this.inputs[ctx.definition.inputHandles[0].id];
    if (!inputs || inputs.length === 0) {
      throw new Error('No input data received on trigger node');
    }

    // Get payload from config
    for (const input of inputs) {
      const payload = input;

      // Optional: Validate against input schema if enforceSchema is true
      if (ctx.config.enforceSchema && ctx.config.inputSchema) {
        ctx.tracker.log('Validating payload against input schema', 'info');
        const validation = validateData(payload, ctx.config.inputSchema);
        if (!validation.valid) {
          throw new Error(`Schema validation failed: ${JSON.stringify(validation.errors)}`);
        }
      }
    }

    // Pass-through to output
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
