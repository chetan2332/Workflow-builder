import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';

/**
 * LLM Node — Call Large Language Models (OpenAI, Anthropic, or custom OpenAI-compatible)
 *
 * Supports:
 * - OpenAI Chat Completions API
 * - Anthropic Messages API
 * - Any OpenAI-compatible endpoint (custom provider)
 *
 * API keys are user-provided via node config (not env vars).
 */
export class LlmNode extends CodeNode {
  protected async executeCode(input: any, ctx: ExecutionContext): Promise<any> {
    const { provider, modelId, apiKey, systemPrompt, userPrompt, temperature, maxTokens, baseUrl } = ctx.config;

    if (!apiKey) {
      throw new Error('API key is required');
    }
    if (!userPrompt) {
      throw new Error('User prompt is required');
    }

    ctx.tracker.log(`Calling ${provider} (${modelId})`, 'info');

    switch (provider) {
      case 'openai':
        return await this.callOpenAI({ modelId, apiKey, systemPrompt, userPrompt, temperature, maxTokens });
      case 'anthropic':
        return await this.callAnthropic({ modelId, apiKey, systemPrompt, userPrompt, temperature, maxTokens });
      case 'custom':
        return await this.callCustom({ modelId, apiKey, systemPrompt, userPrompt, temperature, maxTokens, baseUrl });
      default:
        throw new Error(`Unknown provider: ${provider}`);
    }
  }

  /**
   * OpenAI Chat Completions API
   * POST https://api.openai.com/v1/chat/completions
   */
  private async callOpenAI(params: LlmCallParams): Promise<LlmResult> {
    const { modelId, apiKey, systemPrompt, userPrompt, temperature = 0.7, maxTokens = 1024 } = params;

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      text: choice?.message?.content ?? '',
      model: data.model,
      usage: {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      },
      provider: 'openai',
    };
  }

  /**
   * Anthropic Messages API
   * POST https://api.anthropic.com/v1/messages
   */
  private async callAnthropic(params: LlmCallParams): Promise<LlmResult> {
    const { modelId, apiKey, systemPrompt, userPrompt, temperature = 0.7, maxTokens = 1024 } = params;

    const body: any = {
      model: modelId,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: userPrompt }],
    };

    if (systemPrompt) {
      body.system = systemPrompt;
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const textBlock = data.content?.find((block: any) => block.type === 'text');

    return {
      text: textBlock?.text ?? '',
      model: data.model,
      usage: {
        inputTokens: data.usage?.input_tokens ?? 0,
        outputTokens: data.usage?.output_tokens ?? 0,
      },
      provider: 'anthropic',
    };
  }

  /**
   * Custom OpenAI-compatible endpoint
   * POST {baseUrl}/chat/completions
   */
  private async callCustom(params: LlmCallParams & { baseUrl?: string }): Promise<LlmResult> {
    const { modelId, apiKey, systemPrompt, userPrompt, temperature = 0.7, maxTokens = 1024, baseUrl } = params;

    if (!baseUrl) {
      throw new Error('Base URL is required for custom provider');
    }

    // Strip trailing slash and append path
    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const messages: Array<{ role: string; content: string }> = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: userPrompt });

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: modelId,
        messages,
        temperature,
        max_tokens: maxTokens,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`Custom LLM API error (${response.status}): ${errorBody}`);
    }

    const data = await response.json();
    const choice = data.choices?.[0];

    return {
      text: choice?.message?.content ?? '',
      model: data.model ?? modelId,
      usage: {
        inputTokens: data.usage?.prompt_tokens ?? 0,
        outputTokens: data.usage?.completion_tokens ?? 0,
      },
      provider: 'custom',
    };
  }
}

/** Internal params for provider calls */
interface LlmCallParams {
  modelId: string;
  apiKey: string;
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

/** Unified return shape from all providers */
interface LlmResult {
  text: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
  provider: string;
}
