import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';

/**
 * Base class for all FLOW category nodes (COMBINE, CONDITION, IF, SWITCH)
 *
 * Behavior:
 * - Data routing only - no external execution
 * - Processes each item in inputs.in independently
 * - Subclasses implement route() per item
 */
export abstract class FlowNode extends BaseNode {
  async execute(ctx: ExecutionContext): Promise<NodeOutput> {
    ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');

    this.validateInputHandles(ctx);

    const items: any[] = ctx.inputs['in'] ?? [];
    const outputs: Record<string, any[]> = {};

    for (const item of items) {
      const itemOutputs = this.route(item, ctx.config);

      for (const [handleId, data] of Object.entries(itemOutputs)) {
        if (!outputs[handleId]) outputs[handleId] = [];
        outputs[handleId].push(...data);
      }
    }

    ctx.tracker.log(
      `${ctx.definition.label} routed ${items.length} item(s) to ${Object.keys(outputs).length} output(s)`,
      'info'
    );

    return {
      outputs,
      metadata: { itemsProcessed: items.length }
    };
  }

  /**
   * Subclasses implement routing logic for a single input item.
   * Return a map of handleId → array of items to route there.
   */
  protected abstract route(item: any, config: any): Record<string, any[]>;

  protected evaluateCondition(code: string, input: any): boolean {
    if (!code || !code.trim()) return false;
    try {
      const fn = new Function('input', `return (${code});`);
      return fn(input) === true;
    } catch (error: any) {
      throw new Error(`Condition evaluation failed: ${error.message}`);
    }
  }
}
