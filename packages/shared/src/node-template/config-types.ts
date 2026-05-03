import type { InputObject } from '../common';
import type { TypeSchema } from '../common/type-schema';

/**
 * Type-safe node configuration interfaces
 */

export interface StartNodeConfig {
  /**
   * Sample payload for testing
   *
   * What: Example data shown in UI
   * Why: Helps user understand what format to provide
   * How: Used as placeholder in input dialog, can infer schema from it
   */
  samplePayload?: string | InputObject;

  /**
   * Input schema definition
   *
   * What: Describes expected structure of workflow input
   * Why: Validates runtime payload, prevents errors, provides type hints
   * How: User can auto-infer from sample or build manually
   */
  inputSchema?: TypeSchema;

  /**
   * Whether to enforce schema at runtime
   *
   * What: Master toggle for validation
   * Why: User might want schema for documentation without strict validation
   * How: If false, schema is just documentation; if true, runtime payload validated
   */
  enforceSchema?: boolean;
}

export interface InputNodeConfig {
  valueKind: 'text' | 'number' | 'boolean' | 'json';
  text?: string;
  number?: number;
  boolean?: boolean;
  json?: string;
}

export interface IfNodeConfig {
  inputHandleCount: number;
  inputHandleType: string;
  code: string;
}

export interface SwitchNodeConfig {
  inputHandleCount: number;
  outputHandleCount: number;
  outputLabels?: string[];
  inputHandleType: string;
  outputHandleType: string;
  code: string;
}

export interface FunctionNodeConfig {
  inputHandleCount: number;
  language: 'javascript' | 'python';
  code: string;
}

export interface HttpNodeConfig {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  url: string;
  headers?: Record<string, string>;
  body?: InputObject | string;
  credentialRef?: string;
  timeout?: number;
}

export interface LlmNodeConfig {
  modelId: string;
  credentialRef: string;
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface TransformNodeConfig {
  inputHandleCount: number;
  outputHandleCount: number;
  outputLabels?: string[];
  code: string;
}

export interface FileNodeConfig {
  operation: 'read' | 'write' | 'upload';
  fileRef?: string;
  content?: string;
}

export interface DoNothingNodeConfig {
  // No config
}

// Union type of all node configs
export type NodeConfig =
  | StartNodeConfig
  | InputNodeConfig
  | IfNodeConfig
  | SwitchNodeConfig
  | FunctionNodeConfig
  | HttpNodeConfig
  | LlmNodeConfig
  | TransformNodeConfig
  | FileNodeConfig
  | DoNothingNodeConfig;
