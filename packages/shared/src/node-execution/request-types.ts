import type { InputValue } from '../common';

/**
 * Node execution request (frontend → backend)
 */
export interface NodeExecutionRequest {
  nodeId: string;
  templateId: string;
  templateVersion: string;
  inputs: Record<string, InputValue[]>;
  config: Record<string, unknown>;
}
