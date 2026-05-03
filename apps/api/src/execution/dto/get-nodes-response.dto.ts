import type { NodeDefinition } from '@n8n-project/shared';

/**
 * Response DTO for GET /api/nodes endpoint
 * Returns all available node definitions
 */
export class GetNodesResponseDto {
  /**
   * Array of all node definitions
   */
  nodes: NodeDefinition[];

  /**
   * Total count
   */
  count: number;
}
