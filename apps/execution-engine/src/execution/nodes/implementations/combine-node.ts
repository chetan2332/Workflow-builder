import { FlowNode } from '../categories/flow-node';

/**
 * COMBINE node - Merge multiple inputs into single output
 *
 * Supports strategies:
 * - mergeObjects: { ...in1, ...in2, ... }
 * - concatArrays: [...in1, ...in2, ...]
 * - custom: user-defined code
 */
export class CombineNode extends FlowNode {
  protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]> {
    // Check if all inputs present (if required)
    if (config.waitForAll) {
      const expectedHandles = Object.keys(inputs);
      for (const handleId of expectedHandles) {
        if (!inputs[handleId] || inputs[handleId].length === 0) {
          throw new Error(`Missing data for input: ${handleId}`);
        }
      }
    }

    let result: any;

    switch (config.strategy) {
      case 'mergeObjects':
        // Merge all inputs as objects: { ...in1, ...in2, ... }
        result = Object.assign({}, ...Object.values(inputs).map(arr => arr[0]));
        break;

      case 'concatArrays':
        // Concatenate all inputs as arrays: [...in1, ...in2, ...]
        result = [].concat(...Object.values(inputs).flat());
        break;

      case 'custom':
        // Execute custom code
        result = this.executeCustomCode(config.customCode, inputs);
        break;

      default:
        throw new Error(`Unknown combine strategy: ${config.strategy}`);
    }

    return { out: [result] };
  }

  private executeCustomCode(code: string, inputs: Record<string, any[]>): any {
    try {
      const fn = new Function('inputs', code);
      return fn(inputs);
    } catch (error: any) {
      throw new Error(`Custom combine code failed: ${error.message}`);
    }
  }
}
