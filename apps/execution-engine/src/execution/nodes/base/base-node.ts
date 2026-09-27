import type { NodeDefinition, ConfigField } from '@n8n-project/shared';
import type { ResourceTracker } from '../../utils/resource-tracker';

/**
 * Execution context passed to node.execute()
 * Contains all information needed for node execution
 */


export interface ExecutionContext {
  nodeId: string;
  definition: NodeDefinition;      // Full node definition (includes handles with schemas)
  inputs: Record<string, any[]>;   // Actual runtime data from input handles (handleId -> array of inputs)
  config: any;                     // Node configuration (already validated)
  tracker: ResourceTracker;        // Metrics/logging
}

/**
 * Result returned from node.execute()
 */
export interface NodeOutput {
  outputs: Record<string, any[]>;  // Data for each output handle
  metadata?: {
    duration?: number;
    itemsProcessed?: number;
    logs?: string[];
  };
}

/**
 * Base class for all executable nodes
 *
 * Responsibilities:
 * - Define execute() contract
 * - Provide helper methods for validation, interpolation
 * - Store node ID, definition, and config
 */
export abstract class BaseNode {
  constructor(
    public id: string,              // Runtime node instance ID
    public definition: NodeDefinition,  // Full definition (has schemas in handles)
    public config: any,              // Node configuration (already validated)
    public inputs: Record<string, any[]>   // Input data for this execution (handleId -> input[])
  ) {}

  /**
   * Execute this node instance
   * Subclasses implement this
   */
  abstract execute(ctx: ExecutionContext): Promise<NodeOutput>;

  /**
   * Assert every item in a handle's output array is a plain object.
   * Enforces the "handle data is always keyed objects" contract.
   */
  protected assertObjectItem(item: unknown, handleId: string): void {
    if (typeof item !== 'object' || item === null || Array.isArray(item)) {
      throw new Error(`Output on handle '${handleId}' must be an object, got ${item === null ? 'null' : Array.isArray(item) ? 'array' : typeof item}`);
    }
  }

  /**
   * Validate that input handles match definition
   */
  protected validateInputHandles(ctx: ExecutionContext): void {
    const { definition, inputs } = ctx;

    // Check all required input handles are present
    for (const handleDef of definition.inputHandles) {
      if (!(handleDef.id in inputs)) {
        throw new Error(`Missing required input handle: ${handleDef.id}`);
      }
    }

    // If handles are not dynamic, check for unexpected handles
    if (!definition.dynamicHandles?.inputs) {
      for (const handleId of Object.keys(inputs)) {
        const isDefined = definition.inputHandles.some(h => h.id === handleId);
        if (!isDefined) {
          throw new Error(`Unexpected input handle: ${handleId}`);
        }
      }
    }
  }

  /**
   * Interpolate config values based on definition
   * Only interpolate fields marked with supportsInterpolation: true
   */
  protected interpolateConfig(config: any, input: any, definition: NodeDefinition): any {
    const interpolated = { ...config };

    // Find all fields in definition UI
    const allFields = this.extractFieldsFromDefinition(definition);

    for (const field of allFields) {
      if (field.supportsInterpolation && field.id in interpolated) {
        interpolated[field.id] = this.interpolateValue(interpolated[field.id], input);
      }
    }

    return interpolated;
  }

  /**
   * Check if a field should be visible based on showWhen condition
   */
  protected shouldShowField(field: ConfigField, config: any): boolean {
    if (!field.showWhen) return true;

    try {
      const fn = new Function('config', `return (${field.showWhen});`);
      return fn(config) === true;
    } catch (error) {
      // If evaluation fails, show field by default
      return true;
    }
  }

  /**
   * Extract all fields from definition UI
   */
  protected extractFieldsFromDefinition(definition: NodeDefinition): ConfigField[] {
    return definition.config.fields;
  }

  /**
   * Interpolate {{input.field}} in strings
   */
  protected interpolateValue(value: any, input: any): any {
    if (typeof value !== 'string') return value;

    return value.replace(/\{\{input\.(\w+)\}\}/g, (match, key) => {
      const val = input[key];
      return val !== undefined ? String(val) : match;
    });
  }

  /**
   * Optional: Runtime validation (beyond config schema)
   */
  validate?(): void;
}
