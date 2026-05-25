import { NodeOutput } from '../nodes/base/base-node';
export declare class ExecuteNodeResponseDto {
    success: boolean;
    result?: NodeOutput;
    error?: {
        message: string;
        code?: string;
        stack?: string;
    };
}
