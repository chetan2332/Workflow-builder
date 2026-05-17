import { FlowNode } from '../categories/flow-node';

/**
 * IF node - Binary routing based on a single condition.
 * Each input item routes to exactly one of 'true' or 'false'.
 */
export class IfNode extends FlowNode {
  protected route(item: any, config: any): Record<string, any[]> {
    if (item === undefined) {
      throw new Error('No input data for IF node');
    }

    const result = this.evaluateCondition(config.code, item);
    return result
      ? { true: [item], false: [] }
      : { true: [], false: [item] };
  }
}
