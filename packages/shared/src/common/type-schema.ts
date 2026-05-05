export type DataType = 'any' | 'string' | 'number' | 'boolean' | 'object' | 'array';

// Core type system - recursive, flexible, composable
export interface TypeSchema {
  type: DataType;
  required?: boolean;          // Only for object properties
  itemType?: TypeSchema;       // For arrays
  properties?: TypeProperty[]; // For objects
}

export interface TypeProperty {
  name: string;
  schema: TypeSchema;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  expected?: string;
  actual?: string;
}

// Check if output type matches input type for node connections
export interface CompatibilityResult {
  compatible: boolean;
  reason?: string;
}