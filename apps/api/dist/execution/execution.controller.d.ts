import { ExecutionService } from './execution.service';
import { ExecuteNodeRequestDto } from './dto/execute-node-request.dto';
import { ExecuteNodeResponseDto } from './dto/execute-node-response.dto';
import { GetNodesResponseDto } from './dto/get-nodes-response.dto';
export declare class ExecutionController {
    private readonly executionService;
    constructor(executionService: ExecutionService);
    getNodes(): Promise<GetNodesResponseDto>;
    executeNode(nodeId: string, request: Omit<ExecuteNodeRequestDto, 'nodeId'>): Promise<ExecuteNodeResponseDto>;
}
