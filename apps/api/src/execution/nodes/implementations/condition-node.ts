import { FlowNode } from '../categories/flow-node';

/**
 * CONDITION node - Route to multiple outputs based on conditions
 *
 * Input can match multiple conditions (non-exclusive routing)
 */
export class ConditionNode extends FlowNode {
  protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]> {
    const inputData = inputs.in?.[0];

    if (inputData === undefined) {
      throw new Error('No input data for CONDITION node');
    }

    const outputs: Record<string, any[]> = {};

    // Evaluate each output's condition
    // Note: Input can go to MULTIPLE outputs (non-exclusive)
    for (let i = 0; i < config.outputHandleCount; i++) {
      const condition = this.getConditionForOutput(i, config);
      const result = this.evaluateCondition(condition, inputData);

      if (result === true) {
        const outputId = `out${i + 1}`;
        outputs[outputId] = [inputData];
      }
    }

    return outputs;
  }

  private getConditionForOutput(index: number, config: any): string {
    // Get condition for specific output
    // Assumes config.conditions is an array of condition strings
    return config.conditions?.[index] || 'true';
  }
}
