import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';

/**
 * Base class for all FLOW category nodes (COMBINE, CONDITION, IF, SWITCH)
 *
 * Behavior:
 * - Data routing only - no external execution
 * - Synchronous (no async operations)
 * - Type preservation (outputs derive from inputs)
 * - Subclasses implement route() method
 */
export abstract class FlowNode extends BaseNode {
  async execute(ctx: ExecutionContext): Promise<NodeOutput> {
    // Use definition for logging
    ctx.tracker.log(`Executing ${ctx.definition.label}`, 'info');

    // Validate input handles
    this.validateInputHandles(ctx);

    // FLOW nodes are synchronous routing (no async operations)
    const outputs = this.route(ctx.inputs, ctx.config);

    // Count items routed
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

  /**
   * Subclasses implement ONLY routing logic
   * No validation, no error handling - just pure data routing
   *
   * @param inputs - Data from all input handles
   * @param config - Node configuration
   * @returns Data for each output handle
   */
  protected abstract route(
    inputs: Record<string, any[]>,
    config: any
  ): Record<string, any[]>;

  /**
   * Helper: Evaluate JavaScript condition
   * Available to all FLOW nodes
   */
  protected evaluateCondition(code: string, input: any): boolean {
    try {
      const fn = new Function('input', `return (${code});`);
      return fn(input) === true;
    } catch (error: any) {
      throw new Error(`Condition evaluation failed: ${error.message}`);
    }
  }

  /**
   * Helper: Evaluate JavaScript expression
   * Available to all FLOW nodes
   */
  protected evaluateExpression(code: string, input: any): any {
    try {
      const fn = new Function('input', `return (${code});`);
      return fn(input);
    } catch (error: any) {
      throw new Error(`Expression evaluation failed: ${error.message}`);
    }
  }
}
