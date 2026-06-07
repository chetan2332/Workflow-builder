import { NodeOutput } from '../nodes/base/base-node';

/**
 * Response DTO for node execution
 * Uses NodeOutput from base-node.ts
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
