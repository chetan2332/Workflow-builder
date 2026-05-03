import type { BaseNode } from './base/base-node';
export interface NodeData {
    id: string;
    type: string;
    version: number;
    config: any;
    inputs: Record<string, any[]>;
}
export declare class NodeFactory {
    static create(nodeData: NodeData): BaseNode;
    private static validateFields;
    private static runValidator;
    private static validateConditionalFields;
    private static shouldShowField;
    private static extractFieldsFromDefinition;
    static createAll(workflowNodes: NodeData[]): Map<string, BaseNode>;
    static validate(nodeData: NodeData): {
        valid: boolean;
        errors?: any[];
    };
}
