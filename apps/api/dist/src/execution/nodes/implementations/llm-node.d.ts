import { CodeNode } from '../categories/code-node';
import type { ExecutionContext } from '../base/base-node';
export declare class LlmNode extends CodeNode {
    protected executeCode(input: any, ctx: ExecutionContext): Promise<any>;
}
