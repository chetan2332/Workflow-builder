import { FlowNode } from '../categories/flow-node';

/**
 * CONDITION node - Routes each item to ALL outputs whose condition matches.
 * Non-exclusive: one item can appear in multiple output arrays.
 * config.conditions: Array<{ label: string; condition: string }>
 * Output handles: case-0, case-1, ...
 */
export class ConditionNode extends FlowNode {
  protected route(item: any, config: any): Record<string, any[]> {
    if (item === undefined) {
      throw new Error('No input data for CONDITION node');
    }

    const conditions: Array<{ label: string; condition: string }> = config.conditions ?? [];
    const outputs: Record<string, any[]> = {};

    for (let i = 0; i < conditions.length; i++) {
      if (this.evaluateCondition(conditions[i].condition, item)) {
        outputs[`case-${i}`] = [item];
      }
    }

    return outputs;
  }
}
