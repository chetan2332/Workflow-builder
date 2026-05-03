import type { OutputValue } from '../common';

/**
 * Node execution result (backend → frontend)
 */
export interface NodeExecutionResult {
  success: boolean;
  nodeId: string;
  templateId: string;
  templateVersion: string;
  outputs: Record<string, OutputValue[]>;
  executedHandles: string[];
  metadata: NodeExecutionMetadata;
  error?: NodeExecutionError;
}

/**
 * Execution metadata (resource tracking)
 */
export interface NodeExecutionMetadata {
  startTime: number;
  endTime: number;
  durationMs: number;
  itemsProcessed: number;
  itemsOutput: number;
  memoryUsedMb: number;
  apiCallsMade: number;
  logs: ExecutionLog[];
  warnings: ExecutionWarning[];
}

export interface ExecutionLog {
  timestamp: number;
  level: 'info' | 'debug' | 'error';
  message: string;
  context?: Record<string, unknown>;
}

export interface ExecutionWarning {
  timestamp: number;
  code: string;
  message: string;
  field?: string;
}

/**
 * Execution error structure
 */
export interface NodeExecutionError {
  message: string;
  code: ExecutionErrorCode;
  nodeId: string;
  templateId: string;
  timestamp: number;
  stack?: string;
  details?: ErrorDetails;
}

export type ExecutionErrorCode =
  | 'VALIDATION_ERROR'
  | 'CONFIG_ERROR'
  | 'INPUT_ERROR'
  | 'TIMEOUT_ERROR'
  | 'NETWORK_ERROR'
  | 'CODE_EXECUTION_ERROR'
  | 'SANDBOX_ERROR'
  | 'API_ERROR'
  | 'UNKNOWN_ERROR';

export interface ErrorDetails {
  field?: string;
  expected?: unknown;
  received?: unknown;
  statusCode?: number;
  originalError?: string;
}
