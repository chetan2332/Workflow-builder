import { BaseNode, ExecutionContext, NodeOutput } from '../base/base-node';
import { type NodeDefinition } from '@n8n-project/shared';
export declare abstract class CodeNode extends BaseNode {
    execute(ctx: ExecutionContext): Promise<NodeOutput>;
    protected validateConditionalFields(config: any, definition: NodeDefinition): void;
    protected abstract executeCode(input: any, ctx: ExecutionContext): Promise<any[]>;
    protected interpolate(template: string | any, input: any): any;
    protected interpolateObject(obj: Record<string, any> | undefined, input: any): Record<string, any>;
}
