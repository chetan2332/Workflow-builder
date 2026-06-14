import { Controller, Post, Get, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ExecutionService } from './execution.service';
import { ExecuteNodeRequestDto } from './dto/execute-node-request.dto';
import { ExecuteNodeResponseDto } from './dto/execute-node-response.dto';
import { GetNodesResponseDto } from './dto/get-nodes-response.dto';

/**
 * Execution Controller
 *
 * Endpoints:
 * - GET /api/execution/nodes - Get all node definitions
 * - POST /api/execution/node/:nodeId - Execute a node
 */
@Controller('execution')
export class ExecutionController {
  constructor(private readonly executionService: ExecutionService) {}

  /**
   * GET /api/execution/nodes
   * Get all available node definitions
   * Frontend uses this to render node palette
   *
   * @example
   * GET /api/execution/nodes
   *
   * Response:
   * {
   *   "nodes": [
   *     { "type": "trigger.start", "version": 1, "label": "START", ... },
   *     { "type": "code.http", "version": 1, "label": "HTTP Request", ... },
   *     ...
   *   ],
   *   "count": 8
   * }
   */
  @Get('nodes')
  async getNodes(): Promise<GetNodesResponseDto> {
    return this.executionService.getNodeDefinitions();
  }

  /**
   * POST /api/execution/node/:nodeId
   * Execute a single node with given configuration and inputs
   *
   * @example
   * POST /api/execution/node/node_123
   * {
   *   "type": "code.http",
   *   "version": 1,
   *   "config": {
   *     "method": "GET",
   *     "url": "https://api.example.com/users"
   *   },
   *   "inputs": {
   *     "in": [{ "userId": 123 }]
   *   }
   * }
   *
   * Response:
   * {
   *   "success": true,
   *   "result": {
   *     "outputs": {
   *       "success": [{ "id": 123, "name": "John" }],
   *       "error": []
   *     },
   *     "metadata": {
   *       "duration": 234,
   *       "itemsProcessed": 1
   *     }
   *   }
   * }
   */
  @Post('node/:nodeId')
  @HttpCode(HttpStatus.OK)
  async executeNode(
    @Param('nodeId') nodeId: string,
    @Body() request: Omit<ExecuteNodeRequestDto, 'nodeId'>
  ): Promise<ExecuteNodeResponseDto> {
    return this.executionService.executeNode({
      nodeId,
      ...request
    });
  }
}
