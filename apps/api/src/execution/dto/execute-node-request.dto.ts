/**
 * Request DTO for executing a single node
 */
export class ExecuteNodeRequestDto {
  /**
   * Node ID (from workflow)
   */
  nodeId!: string;

  /**
   * Node type (e.g., "code.http", "flow.if")
   */
  type!: string;

  /**
   * Node version
   */
  version!: number;

  /**
   * Node configuration
   */
  config!: any;

  /**
   * Input data for each input handle
   * Key: handleId, Value: array of input items
   */
  inputs!: Record<string, any[]>;
}
