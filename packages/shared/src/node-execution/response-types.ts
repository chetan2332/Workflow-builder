import type { InputObject, InputArray } from '../common';

/**
 * HTTP response structure (from HTTP nodes)
 */
export interface HttpResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string | InputObject | InputArray;
}

/**
 * LLM response structure (from LLM nodes)
 */
export interface LlmResponse {
  completion: string;
  model: string;
  usage: TokenUsage;
  finishReason?: 'stop' | 'length' | 'content_filter';
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
