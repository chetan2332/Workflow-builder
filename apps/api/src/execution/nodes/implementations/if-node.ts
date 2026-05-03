import { FlowNode } from '../categories/flow-node';

/**
 * IF node - Binary routing based on condition
 *
 * Routes to 'true' or 'false' output based on condition evaluation
 */
export class IfNode extends FlowNode {
  protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]> {
    const inputData = inputs.in?.[0];

    if (inputData === undefined) {
      throw new Error('No input data for IF node');
    }

    // Evaluate condition
    const result = this.evaluateCondition(config.code, inputData);

    // Route to true OR false output (mutually exclusive)
    return result
      ? { true: [inputData], false: [] }
      : { true: [], false: [inputData] };
  }
}
