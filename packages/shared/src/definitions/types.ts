import type { TypeSchema } from '../common/type-schema';

// ============================================
// Enums
// ============================================

export enum NodeCategory {
  TRIGGER = 'Trigger',
  CODE = 'Code',
  FLOW = 'Flow',
  OTHER = 'Other'
}

export enum NodeShape {
  CIRCLE = 'circle',
  OPPOSITE_D = 'oppositeD',
  ROUNDED_RECTANGLE = 'roundedRectangle',
  RECTANGLE_WITH_TEXT = 'rectangleWithText',
  D = 'D'
}

// ============================================
// Field Types
// ============================================

// Field validation: enum, regex, range, or custom function
export type FieldValidator = {
  type: 'enum' | 'regex' | 'range' | 'custom';
  enum?: string[];
  pattern?: string;
  message?: string;
  min?: number;
  max?: number;
  validate?: (value: any, config?: any) => boolean | string;
};

// Supported field types for node configuration
export type ConfigFieldType =
  | 'string'
  | 'number'
  | 'boolean'
  | 'select'
  | 'textarea'
  | 'code'
  | 'json'
  | 'keyValue'
  | 'file'
  | 'credentialRef'
  | 'input'
  | 'cases'; // Dynamic list of { label, condition } items — used by SWITCH and CONDITION

// Configuration field for node UI
export type ConfigField = {
  id: string;
  type: ConfigFieldType;
  label: string;
  required: boolean;
  default?: any;
  placeholder?: string;
  description?: string;
  tab?: string;  // Which tab this field belongs to

  validator?: FieldValidator;
  options?: string[] | Array<{ value: string; label: string }> | 'dynamic';
  showWhen?: string;  // JS expression for conditional display
  supportsInterpolation?: boolean;  // Allow {{input.field}} syntax
  multiple?: boolean;  // For file/select fields
  language?: 'javascript' | 'python';  // For code fields

  min?: number;
  max?: number;
  step?: number;
};

// ============================================
// Handle Types
// ============================================

// Handle represents an input, output, or config connection point on a node
export type Handle = {
  id: string;
  label: string;
  type: 'input' | 'output' | 'config';
  schema: TypeSchema;          // Runtime data type
  data?: any;                  // Optional data attached to handle
  fixed: boolean;              // Can user add/remove this handle?
  schemaEditable: boolean;     // Can user edit the schema?
};

// ============================================
// Node Configuration
// ============================================

// Node action configuration
export interface NodeConfig {
  fields: ConfigField[];
  tabs?: string[];
}

// ============================================
// Node Definition
// ============================================

// Node Definition - Single source of truth for node structure
export type NodeDefinition = {
  type: string;
  version: number;
  category: NodeCategory;

  label: string;
  description: string;
  icon?: string;
  shape: NodeShape;

  inputHandles: Handle[];
  outputHandles: Handle[];
  configHandles?: Handle[];
  dynamicHandles?: {
    inputs: boolean;
    outputs: boolean;
  };

  configSchema: TypeSchema;  // Validates entire config object
  config: NodeConfig;
  defaultConfigValues: Record<string, any>;
};
