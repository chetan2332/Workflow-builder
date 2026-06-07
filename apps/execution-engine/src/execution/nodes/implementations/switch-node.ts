import { FlowNode } from '../categories/flow-node';

/**
 * SWITCH node - Routes each item to the first matching case.
 * Falls back to 'default' when no case condition matches.
 * config.cases: Array<{ label: string; condition: string }>
 * Output handles: case-0, case-1, ..., default
 */
export class SwitchNode extends FlowNode {
  protected route(item: any, config: any): Record<string, any[]> {
    if (item === undefined) {
      throw new Error('No input data for SWITCH node');
    }

    const cases: Array<{ label: string; condition: string }> = config.cases ?? [];

    for (let i = 0; i < cases.length; i++) {
      if (this.evaluateCondition(cases[i].condition, item)) {
        return { [`case-${i}`]: [item] };
      }
    }

    return { default: [item] };
  }
}
