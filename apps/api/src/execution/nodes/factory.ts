import type { BaseNode } from './base/base-node';
import { NodeRegistry, getNodeDefinition, getNodeClass } from './registry';
import { validateData, type NodeDefinition, type ConfigField, type FieldValidator } from '@n8n-project/shared';

/**
 * Node data from workflow JSON
 */
export interface NodeData {
  id: string;
  type: string;
  version: number;
  config: any;
  inputs: Record<string, any[]>;  // Runtime input data
}

/**
 * Node Factory - Creates node instances from workflow data
 *
 * Responsibilities:
 * - Validate config against definition's configSchema
 * - Run field-level validators (enum, range, regex, custom)
 * - Validate conditional fields (showWhen)
 * - Instantiate node class
 */
export class NodeFactory {
  /**
   * Create a single node instance from workflow data
   */
  static create(nodeData: NodeData): BaseNode {
    const { id, type, version, config, inputs } = nodeData;

    // Step 1: Get definition from registry
    const definition = getNodeDefinition(type, version);
    if (!definition) {
      throw new Error(`Unknown node type: ${type}@${version}`);
    }

    // Step 2: Validate config against definition's configSchema
    const validation = validateData(config, definition.configSchema);
    if (!validation.valid) {
      throw new Error(
        `Config validation failed for ${type}: ${JSON.stringify(validation.errors)}`
      );
    }

    // Step 3: Run field-level validators (enum, range, regex, custom)
    this.validateFields(config, definition);

    // Step 4: Validate conditional fields (showWhen)
    this.validateConditionalFields(config, definition);

    // Step 5: Get node class from registry
    const NodeClass = getNodeClass(type, version);
    if (!NodeClass) {
      throw new Error(`No implementation found for ${type}@${version}`);
    }

    // Step 6: Instantiate node with definition and inputs
    return new NodeClass(id, definition, config, inputs);
  }

  /**
   * Validate field-level validators (enum, range, regex, custom)
   */
  private static validateFields(config: any, definition: NodeDefinition): void {
    const allFields = this.extractFieldsFromDefinition(definition);

    for (const field of allFields) {
      // Skip if field not in config or not visible
      if (!(field.id in config)) continue;
      if (!this.shouldShowField(field, config)) continue;

      const value = config[field.id];

      // Run validator if present
      if (field.validator) {
        this.runValidator(field, value, config);
      }
    }
  }

  /**
   * Run a single field validator
   */
  private static runValidator(field: ConfigField, value: any, config: any): void {
    const validator = field.validator!;

    switch (validator.type) {
      case 'enum':
        if (validator.enum && !validator.enum.includes(value)) {
          throw new Error(
            `${field.label} must be one of: ${validator.enum.join(', ')}. Got: ${value}`
          );
        }
        break;

      case 'range':
        if (typeof value === 'number') {
          if (validator.min !== undefined && value < validator.min) {
            throw new Error(
              `${field.label} must be >= ${validator.min}. Got: ${value}`
            );
          }
          if (validator.max !== undefined && value > validator.max) {
            throw new Error(
              `${field.label} must be <= ${validator.max}. Got: ${value}`
            );
          }
        }
        break;

      case 'regex':
        if (validator.pattern && typeof value === 'string') {
          const regex = new RegExp(validator.pattern);
          if (!regex.test(value)) {
            throw new Error(
              validator.message || `${field.label} format is invalid`
            );
          }
        }
        break;

      case 'custom':
        if (validator.validate) {
          const result = validator.validate(value, config);
          if (typeof result === 'string') {
            throw new Error(result);  // Error message returned
          }
          if (result === false) {
            throw new Error(`${field.label} validation failed`);
          }
        }
        break;
    }
  }

  /**
   * Validate conditional fields (showWhen)
   * If field is hidden but has a required value, throw error
   */
  private static validateConditionalFields(config: any, definition: NodeDefinition): void {
    const allFields = this.extractFieldsFromDefinition(definition);

    for (const field of allFields) {
      const shouldShow = this.shouldShowField(field, config);

      // If field is hidden and required, it should not be in config
      if (!shouldShow && field.required && field.id in config) {
        throw new Error(
          `Field '${field.label}' should not be present when condition '${field.showWhen}' is false`
        );
      }
    }
  }

  /**
   * Check if a field should be visible based on showWhen condition
   */
  private static shouldShowField(field: ConfigField, config: any): boolean {
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
  private static extractFieldsFromDefinition(definition: NodeDefinition): ConfigField[] {
    return definition.config.fields;
  }

  /**
   * Create all nodes in a workflow
   * Returns Map of nodeId → BaseNode instance
   */
  static createAll(workflowNodes: NodeData[]): Map<string, BaseNode> {
    const nodes = new Map<string, BaseNode>();

    for (const nodeData of workflowNodes) {
      try {
        const node = this.create(nodeData);
        nodes.set(node.id, node);
      } catch (error: any) {
        throw new Error(
          `Failed to create node ${nodeData.id} (${nodeData.type}): ${error.message}`
        );
      }
    }

    return nodes;
  }

  /**
   * Validate a node without instantiating
   * Useful for frontend validation or pre-flight checks
   */
  static validate(nodeData: NodeData): { valid: boolean; errors?: any[] } {
    try {
      const definition = getNodeDefinition(nodeData.type, nodeData.version);
      if (!definition) {
        return {
          valid: false,
          errors: [{ message: `Unknown node type: ${nodeData.type}` }]
        };
      }

      // Config schema validation
      const validation = validateData(nodeData.config, definition.configSchema);
      if (!validation.valid) {
        return validation;
      }

      // Field-level validation
      this.validateFields(nodeData.config, definition);

      // Conditional fields validation
      this.validateConditionalFields(nodeData.config, definition);

      return { valid: true };

    } catch (error: any) {
      return {
        valid: false,
        errors: [{ message: error.message }]
      };
    }
  }
}
