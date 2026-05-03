import type { NodeDefinition, ConfigField } from '@n8n-project/shared';
import type { ResourceTracker } from '../../utils/resource-tracker';
export interface ExecutionContext {
    nodeId: string;
    definition: NodeDefinition;
    inputs: Record<string, any[]>;
    config: any;
    tracker: ResourceTracker;
}
export interface NodeOutput {
    outputs: Record<string, any[]>;
    metadata?: {
        duration?: number;
        itemsProcessed?: number;
        logs?: string[];
    };
}
export declare abstract class BaseNode {
    id: string;
    definition: NodeDefinition;
    config: any;
    inputs: Record<string, any[]>;
    constructor(id: string, definition: NodeDefinition, config: any, inputs: Record<string, any[]>);
    abstract execute(ctx: ExecutionContext): Promise<NodeOutput>;
    protected validateInputHandles(ctx: ExecutionContext): void;
    protected interpolateConfig(config: any, input: any, definition: NodeDefinition): any;
    protected shouldShowField(field: ConfigField, config: any): boolean;
    protected extractFieldsFromDefinition(definition: NodeDefinition): ConfigField[];
    protected interpolateValue(value: any, input: any): any;
    validate?(): void;
}
