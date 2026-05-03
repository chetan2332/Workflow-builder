import { FlowNode } from '../categories/flow-node';

/**
 * SWITCH node - Multi-way routing based on value matching
 *
 * Routes to matching case output, or default if no match
 */
export class SwitchNode extends FlowNode {
  protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]> {
    const inputData = inputs.in?.[0];

    if (inputData === undefined) {
      throw new Error('No input data for SWITCH node');
    }

    // Evaluate switch expression
    const switchValue = this.evaluateExpression(config.code, inputData);

    // Find matching case
    let matchedOutput: string | null = null;

    // Check each case output
    for (let i = 0; i < config.outputHandleCount; i++) {
      const caseValue = config.outputLabels?.[i];
      if (caseValue === switchValue) {
        matchedOutput = `case${i + 1}`;
        break;
      }
    }

    // Handle default case
    if (!matchedOutput) {
      if (config.enableDefault) {
        matchedOutput = 'default';
      } else {
        // No match, no default - no output
        return {};
      }
    }

    // Route to matched output only
    return { [matchedOutput]: [inputData] };
  }
}
