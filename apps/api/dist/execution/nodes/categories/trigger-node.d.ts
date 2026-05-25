import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
export declare abstract class TriggerNode extends BaseNode {
    execute(ctx: ExecutionContext): Promise<NodeOutput>;
}
