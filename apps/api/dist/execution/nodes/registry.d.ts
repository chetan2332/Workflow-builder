import type { NodeDefinition } from '@n8n-project/shared';
import type { BaseNode } from './base/base-node';
export interface RegistryEntry {
    definition: NodeDefinition;
    class: new (id: string, definition: NodeDefinition, config: any, inputs: Record<string, any[]>) => BaseNode;
}
export declare const NodeRegistry: Record<string, Record<number, RegistryEntry>>;
export declare function getAllNodeDefinitions(): NodeDefinition[];
export declare function getNodeDefinition(type: string, version: number): NodeDefinition | undefined;
export declare function getNodeClass(type: string, version: number): new (id: string, definition: NodeDefinition, config: any, inputs: Record<string, any[]>) => BaseNode;
export declare function hasNodeType(type: string, version?: number): boolean;
