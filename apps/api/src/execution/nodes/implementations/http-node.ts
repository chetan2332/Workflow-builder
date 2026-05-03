import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

/**
 * HTTP node - Make HTTP/REST API calls
 *
 * Supports:
 * - All HTTP methods (GET, POST, PUT, PATCH, DELETE, etc.)
 * - Input interpolation in URL, headers, body
 * - Output parsing
 */
export class HttpNode extends CodeNode {
  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const config = ctx.config;

    // Interpolate URL, headers, body with input values
    // Note: Config is already interpolated by CodeNode base class
    const url = config.url;
    const headers = config.headers || {};
    const body = config.body;

    ctx.tracker.log(`Making ${config.method} request to ${url}`, 'info');

    // Make HTTP request
    const response = await fetch(url, {
      method: config.method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(config.timeout || 30000)
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let result = await response.json();

    // Apply output parser if provided
    if (config.outputParser) {
      result = this.parseOutput(result, config.outputParser);
    }

    return result;
  }

  private parseOutput(data: any, parser: string): any {
    // Parse expression like "res.data.items[0]"
    try {
      const fn = new Function('res', `return ${parser};`);
      return fn(data);
    } catch (error: any) {
      throw new Error(`Output parser failed: ${error.message}`);
    }
  }
}
