/**
 * Node template configuration types
 */

import type { TypeSchema } from '../common/type-schema';

// Node type enum (matches Prisma but as string literals)
export type NodeType = 'TRIGGER' | 'CODE' | 'CONDITION' | 'OTHER';

// Node shape enum
export type NodeShape =
  | 'circle'
  | 'oppositeD'
  | 'roundedRectangle'
  | 'rectangleWithText';

// Handle configuration
export interface HandleConfig {
  id: string;
  side: 'left' | 'right' | 'top' | 'bottom';
  kind: 'input' | 'output';
  label?: string;

  /**
   * Legacy type (backward compatible)
   *
   * Why keep this?
   * - Existing nodes use this
   * - Simple cases don't need complex schema
   * - Gradual migration (not breaking change)
   */
  type?: 'any' | 'flow' | 'json' | 'string' | 'number' | 'boolean';

  /**
   * Rich type schema (new, optional)
   *
   * Why optional?
   * - Backward compatibility
   * - Gradual adoption
   * - Simple nodes can use string type, complex nodes use schema
   *
   * When to use:
   * - HTTP node output: describe response structure
   * - Function node input: describe expected input structure
   * - Any complex data flow
   */
  dataType?: TypeSchema;
}

// Action field types
export type ActionFieldType =
  | 'string'
  | 'number'
  | 'textarea'
  | 'select'
  | 'text'
  | 'boolean'
  | 'enum'
  | 'json'
  | 'code'
  | 'url'
  | 'httpMethod'
  | 'keyValue'
  | 'secretRef'
  | 'credentialRef'
  | 'fileRef'
  | 'modelRef'
  | 'handleCount'
  | 'handleLabels'
  | 'handleTypes'
  | 'inlineText'
  | 'triggerInvokeInfo';

// Action field configuration
export interface ActionField {
  id: string;
  label: string;
  type: ActionFieldType;
  defaultValue?: string | number | boolean;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  language?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  helpText?: string;
  tab?: string;
}

// Node action configuration
export interface NodeActionConfig {
  title: string;
  description?: string;
  fields: ActionField[];
  tabs?: string[];
}

// Complete node template structure
export interface NodeTemplate {
  id: string;
  templateId: string;
  version: string;
  name: string;
  description: string | null;
  nodeType: NodeType;
  shape: NodeShape;
  handlesConfig: HandleConfig[];
  actionConfig: NodeActionConfig;
  dynamicHandles: {
    inputs: boolean;
    outputs: boolean;
  } | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
