import { FlowNode } from '../categories/flow-node';
export declare class SwitchNode extends FlowNode {
    protected route(inputs: Record<string, any[]>, config: any): Record<string, any[]>;
}
