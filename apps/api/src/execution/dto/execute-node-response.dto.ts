/**
 * Node execution result (outputs + metadata).
 * The API only proxies this shape from the execution engine.
 */
export interface NodeOutput {
  outputs: Record<string, any[]>;
  metadata?: {
    duration?: number;
    itemsProcessed?: number;
    logs?: string[];
  };
}

/**
 * Response DTO for node execution
 */
export class ExecuteNodeResponseDto {
  /**
   * Execution success status
   */
  success!: boolean;

  /**
   * Node execution result (outputs + metadata)
   */
  result?: NodeOutput;

  /**
   * Error details (if success is false)
   */
  error?: {
    message: string;
    code?: string;
    stack?: string;
  };
}
