import { FlowNode } from '../categories/flow-node';
export declare class ConditionNode extends FlowNode {
    protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]>;
    private getConditionForOutput;
}
