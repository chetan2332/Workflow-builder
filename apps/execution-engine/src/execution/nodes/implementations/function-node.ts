import ivm from 'isolated-vm';
import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

/**
 * FUNCTION node — Execute custom JavaScript code in a sandboxed V8 isolate.
 *
 * User code runs in a completely isolated environment:
 * - No access to Node.js APIs (require, process, fs, fetch, etc.)
 * - Memory limited to 128MB
 * - Execution timeout of 5 seconds
 * - Only `input` is available as a global variable
 *
 * User's code is wrapped as: (function() { <user code> })()
 * The code must `return` a value.
 */
export class FunctionNode extends CodeNode {
  private static readonly MEMORY_LIMIT_MB = 128;
  private static readonly TIMEOUT_MS = 5000;

  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const { code } = ctx.config;

    if (!code || !code.trim()) {
      throw new Error('Function code is required');
    }

    ctx.tracker.log('Executing user function in sandbox', 'info');

    const isolate = new ivm.Isolate({ memoryLimit: FunctionNode.MEMORY_LIMIT_MB });

    try {
      const context = await isolate.createContext();
      const jail = context.global;

      // Inject input as a read-only global (serialized via JSON)
      await jail.set('__inputJson', JSON.stringify(input), { copy: true });

      // Wrap user code: parse input, execute their code, return result as JSON
      const wrappedCode = `
        const input = JSON.parse(__inputJson);
        const __result = (function() {
          ${code}
        })();
        JSON.stringify(__result);
      `;

      const script = await isolate.compileScript(wrappedCode);
      const resultJson = await script.run(context, { timeout: FunctionNode.TIMEOUT_MS });

      if (resultJson === undefined) {
        throw new Error('Function did not return a value. Make sure your code has a return statement.');
      }

      return JSON.parse(resultJson);
    } catch (error: any) {
      if (error.message?.includes('Script execution timed out')) {
        throw new Error('Function execution timed out (5s limit)');
      }
      if (error.message?.includes('isolate was disposed')) {
        throw new Error('Function exceeded memory limit (128MB)');
      }
      throw new Error(`Function execution failed: ${error.message}`);
    } finally {
      isolate.dispose();
    }
  }
}
