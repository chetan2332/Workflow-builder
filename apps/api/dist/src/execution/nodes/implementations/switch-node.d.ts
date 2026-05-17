import { FlowNode } from '../categories/flow-node';
export declare class SwitchNode extends FlowNode {
    protected route(item: any, config: any): Record<string, any[]>;
}
