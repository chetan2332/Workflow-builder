import type { NodeDefinition } from '@n8n-project/shared';
import type { BaseNode } from './base/base-node';

// Import all definitions
import {
  startDefinition,
  httpDefinition,
  llmDefinition,
  functionDefinition,
  ifDefinition,
  switchDefinition,
  conditionDefinition,
  combineDefinition
} from '@n8n-project/shared';

// Import all implementations
import { StartNode } from './implementations/start-node';
import { HttpNode } from './implementations/http-node';
import { LlmNode } from './implementations/llm-node';
import { FunctionNode } from './implementations/function-node';
import { IfNode } from './implementations/if-node';
import { SwitchNode } from './implementations/switch-node';
import { ConditionNode } from './implementations/condition-node';
import { CombineNode } from './implementations/combine-node';

/**
 * Registry entry - maps definition to implementation class
 */
export interface RegistryEntry {
  definition: NodeDefinition;
  class: new (id: string, definition: NodeDefinition, config: any, inputs: Record<string, any[]>) => BaseNode;
}

/**
 * Node Registry - Central mapping of type + version → {definition, class}
 *
 * Purpose:
 * - Bridge between Layer A (definitions) and Layer D (implementations)
 * - Supports versioning (type + version)
 * - Powers /api/nodes endpoint (returns all definitions)
 * - Used by Factory to instantiate nodes
 */
export const NodeRegistry: Record<string, Record<number, RegistryEntry>> = {
  'trigger.start': {
    1: {
      definition: startDefinition,
      class: StartNode
    }
  },

  'code.http': {
    1: {
      definition: httpDefinition,
      class: HttpNode
    }
  },

  'code.llm': {
    1: {
      definition: llmDefinition,
      class: LlmNode
    }
  },

  'code.function': {
    1: {
      definition: functionDefinition,
      class: FunctionNode
    }
  },

  'flow.if': {
    1: {
      definition: ifDefinition,
      class: IfNode
    }
  },

  'flow.switch': {
    1: {
      definition: switchDefinition,
      class: SwitchNode
    }
  },

  'flow.condition': {
    1: {
      definition: conditionDefinition,
      class: ConditionNode
    }
  },

  'flow.combine': {
    1: {
      definition: combineDefinition,
      class: CombineNode
    }
  }
};

/**
 * Get all node definitions (for frontend /api/nodes endpoint)
 */
export function getAllNodeDefinitions(): NodeDefinition[] {
  return Object.values(NodeRegistry)
    .flatMap(versions => Object.values(versions))
    .map(entry => entry.definition);
}

/**
 * Get specific node definition
 */
export function getNodeDefinition(type: string, version: number): NodeDefinition | undefined {
  return NodeRegistry[type]?.[version]?.definition;
}

/**
 * Get node class for instantiation
 */
export function getNodeClass(type: string, version: number) {
  return NodeRegistry[type]?.[version]?.class;
}

/**
 * Check if node type exists
 */
export function hasNodeType(type: string, version: number = 1): boolean {
  return !!NodeRegistry[type]?.[version];
}
