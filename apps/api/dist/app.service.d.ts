import type { NodeDefinition } from '@n8n-project/shared';
export interface RegistryEntry {
    definition: NodeDefinition;
}
export declare const NodeRegistry: Record<string, Record<number, RegistryEntry>>;
export declare class AppService {
    getHello(): string;
    getNodes(): NodeDefinition[];
}
