import { FlowNode } from '../categories/flow-node';
export declare class CombineNode extends FlowNode {
    protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]>;
    private executeCustomCode;
}
