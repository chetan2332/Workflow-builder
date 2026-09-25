import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import {
  startDefinition,
  httpDefinition,
  llmDefinition,
  functionDefinition,
  ifDefinition,
  switchDefinition,
  conditionDefinition,
  combineDefinition,
} from '@n8n-project/shared';
import type { NodeDefinition } from '@n8n-project/shared';
import { ExecuteNodeRequestDto } from './dto/execute-node-request.dto';
import { ExecuteNodeResponseDto } from './dto/execute-node-response.dto';
import { GetNodesResponseDto } from './dto/get-nodes-response.dto';

const allDefinitions: NodeDefinition[] = [
  startDefinition,
  httpDefinition,
  llmDefinition,
  functionDefinition,
  ifDefinition,
  switchDefinition,
  conditionDefinition,
  combineDefinition,
];

@Injectable()
export class ExecutionService {
  private readonly engineUrl = process.env.EXECUTION_ENGINE_URL ?? 'http://localhost:3001';

  constructor(private readonly http: HttpService) {}

  async executeNode(request: ExecuteNodeRequestDto): Promise<ExecuteNodeResponseDto> {
    const { nodeId, type, version, config, inputs } = request;

    try {
      const { data } = await firstValueFrom(
        this.http.post<ExecuteNodeResponseDto>(
          `${this.engineUrl}/api/execution/node/${nodeId}`,
          { nodeId, type, version, config, inputs }
        )
      );
      return data;
    } catch (error: any) {
      const status = error.response?.status;
      const body = error.response?.data;

      if (status === 400) {
        throw new BadRequestException(body);
      }

      throw new InternalServerErrorException(
        body ?? {
          success: false,
          error: { message: error.message, code: 'EXECUTION_ENGINE_ERROR' }
        }
      );
    }
  }

  async getNodeDefinitions(): Promise<GetNodesResponseDto> {
    return { nodes: allDefinitions, count: allDefinitions.length };
  }
}

