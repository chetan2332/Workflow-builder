import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

/**
 * FUNCTION node - Execute custom JavaScript code
 *
 * User's code is wrapped in: function(input) { <user code> }
 * TODO: Implement proper sandboxing (vm2, isolated-vm)
 */
export class FunctionNode extends CodeNode {
  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const config = ctx.config;

    ctx.tracker.log('Executing user function', 'info');

    // Create sandboxed function
    // User's code is just the function body
    // We wrap it in: function(input) { <user code> }
    const userFunction = this.createSandboxedFunction(config.code);

    // Execute with input
    const result = await userFunction(input);

    return result;
  }

  private createSandboxedFunction(code: string): Function {
    // TODO: Implement proper sandboxing (vm2, isolated-vm, etc.)
    // For now, simple Function constructor (UNSAFE for production)

    try {
      // Wrap user code in function
      const fn = new Function('input', code);
      return fn;
    } catch (error: any) {
      throw new Error(`Function compilation failed: ${error.message}`);
    }
  }
}
