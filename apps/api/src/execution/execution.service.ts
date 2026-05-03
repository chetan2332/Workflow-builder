import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { NodeFactory } from './nodes/factory';
import { getAllNodeDefinitions } from './nodes/registry';
import { ResourceTracker } from './utils/resource-tracker';
import { ExecuteNodeRequestDto } from './dto/execute-node-request.dto';
import { ExecuteNodeResponseDto } from './dto/execute-node-response.dto';
import { GetNodesResponseDto } from './dto/get-nodes-response.dto';

/**
 * Execution Service
 *
 * Handles:
 * - Node execution (single node runs)
 * - Node definitions retrieval
 */
@Injectable()
export class ExecutionService {
  /**
   * Execute a single node
   */
  async executeNode(request: ExecuteNodeRequestDto): Promise<ExecuteNodeResponseDto> {
    const { nodeId, type, version, config, inputs } = request;

    try {
      // Create node instance using factory
      const node = NodeFactory.create({
        id: nodeId,
        type,
        version,
        config,
        inputs
      });

      // Create execution context
      const tracker = new ResourceTracker();
      const ctx = {
        nodeId: node.id,
        definition: node.definition,
        inputs,
        config,
        tracker
      };

      // Execute node
      const result = await node.execute(ctx);

      // Return formatted response
      return {
        success: true,
        result
      };

    } catch (error: any) {
      // If it's a validation error, return as bad request
      if (error.message.includes('validation') || error.message.includes('Unknown node type')) {
        throw new BadRequestException({
          success: false,
          error: {
            message: error.message,
            code: 'VALIDATION_ERROR'
          }
        });
      }

      // Otherwise, internal server error
      throw new InternalServerErrorException({
        success: false,
        error: {
          message: error.message,
          code: error.code || 'EXECUTION_ERROR',
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }
      });
    }
  }

  /**
   * Get all available node definitions
   */
  async getNodeDefinitions(): Promise<GetNodesResponseDto> {
    const definitions = getAllNodeDefinitions();

    return {
      nodes: definitions,
      count: definitions.length
    };
  }
}
