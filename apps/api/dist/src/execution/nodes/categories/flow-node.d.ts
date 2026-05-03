import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
export declare abstract class FlowNode extends BaseNode {
    execute(ctx: ExecutionContext): Promise<NodeOutput>;
    protected abstract route(inputs: Record<string, any[]>, config: any): Record<string, any[]>;
    protected evaluateCondition(code: string, input: any): boolean;
    protected evaluateExpression(code: string, input: any): any;
}
