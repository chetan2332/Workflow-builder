import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

export class HttpNode extends CodeNode {
  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const config = ctx.config;

    const headersArray: { key: string; value: string }[] = config.headers ?? [];
    const userHeaders = Object.fromEntries(
      headersArray.filter(p => p.key.trim()).map(p => [p.key, p.value])
    );

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...userHeaders,
    };

    ctx.tracker.log(`Making ${config.method} request to ${config.url}`, 'info');

    const response = await fetch(config.url, {
      method: config.method,
      headers,
      body: config.body ? JSON.stringify(config.body) : undefined,
      signal: AbortSignal.timeout(config.timeout || 30000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const result = contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    const responseKey = config.responseKey?.trim() || 'response';
    return { [responseKey]: result };
  }
}
