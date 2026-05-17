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
    ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');

    const payload = ctx.config.input?.payload ?? {};

    if (ctx.config.input?.schema) {
      ctx.tracker.log('Validating payload against input schema', 'info');
      const validation = validateData(payload, ctx.config.input.schema);
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
