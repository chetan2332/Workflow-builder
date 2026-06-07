import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

/**
 * LLM node - Call Large Language Models
 *
 * TODO: Implement LLM API calls
 */
export class LlmNode extends CodeNode {
  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const config = ctx.config;

    // Config is already interpolated by CodeNode
    const systemPrompt = config.systemPrompt;
    const userPrompt = config.userPrompt;

    ctx.tracker.log(`Calling ${config.provider} (${config.modelId})`, 'info');

    // TODO: Implement LLM API calls based on provider
    throw new Error('LLM node not yet implemented');

    // Future implementation:
    // switch (config.provider) {
    //   case 'openai':
    //     return await this.callOpenAI(config, systemPrompt, userPrompt);
    //   case 'anthropic':
    //     return await this.callAnthropic(config, systemPrompt, userPrompt);
    //   default:
    //     throw new Error(`Unknown provider: ${config.provider}`);
    // }
  }
}
