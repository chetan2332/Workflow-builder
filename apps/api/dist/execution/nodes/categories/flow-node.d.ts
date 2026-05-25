import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
export declare abstract class FlowNode extends BaseNode {
    execute(ctx: ExecutionContext): Promise<NodeOutput>;
    protected abstract route(item: any, config: any): Record<string, any[]>;
    protected evaluateCondition(code: string, input: any): boolean;
}
