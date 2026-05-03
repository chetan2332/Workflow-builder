import { ExecuteNodeRequestDto } from './dto/execute-node-request.dto';
import { ExecuteNodeResponseDto } from './dto/execute-node-response.dto';
import { GetNodesResponseDto } from './dto/get-nodes-response.dto';
export declare class ExecutionService {
    executeNode(request: ExecuteNodeRequestDto): Promise<ExecuteNodeResponseDto>;
    getNodeDefinitions(): Promise<GetNodesResponseDto>;
}
