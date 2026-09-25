import ivm from 'isolated-vm';
import { FlowNode } from '../categories/flow-node';

/**
 * COMBINE node - Merge multiple inputs into single output
 *
 * Supports strategies:
 * - mergeObjects: { ...in1, ...in2, ... }
 * - concatArrays: [...in1, ...in2, ...]
 * - custom: user-defined code (sandboxed via isolated-vm)
 */
export class CombineNode extends FlowNode {
  private static readonly MEMORY_LIMIT_MB = 128;
  private static readonly TIMEOUT_MS = 5000;

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
        // Execute custom code in sandbox
        result = this.executeCustomCode(config.customCode, inputs);
        break;

      default:
        throw new Error(`Unknown combine strategy: ${config.strategy}`);
    }

    return { out: [result] };
  }

  private executeCustomCode(code: string, inputs: Record<string, any[]>): any {
    if (!code || !code.trim()) {
      throw new Error('Custom combine code is required');
    }

    const isolate = new ivm.Isolate({ memoryLimit: CombineNode.MEMORY_LIMIT_MB });

    try {
      const context = isolate.createContextSync();
      const jail = context.global;

      // Inject inputs as a read-only global
      jail.setSync('__inputsJson', JSON.stringify(inputs), { copy: true });

      const wrappedCode = `
        const inputs = JSON.parse(__inputsJson);
        const __result = (function() {
          ${code}
        })();
        JSON.stringify(__result);
      `;

      const script = isolate.compileScriptSync(wrappedCode);
      const resultJson = script.runSync(context, { timeout: CombineNode.TIMEOUT_MS });

      if (resultJson === undefined) {
        throw new Error('Custom code did not return a value. Make sure your code has a return statement.');
      }

      return JSON.parse(resultJson);
    } catch (error: any) {
      if (error.message?.includes('Script execution timed out')) {
        throw new Error('Custom combine code timed out (5s limit)');
      }
      if (error.message?.includes('isolate was disposed')) {
        throw new Error('Custom combine code exceeded memory limit (128MB)');
      }
      throw new Error(`Custom combine code failed: ${error.message}`);
    } finally {
      isolate.dispose();
    }
  }
}
