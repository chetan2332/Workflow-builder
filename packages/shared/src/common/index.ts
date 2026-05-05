// Type system exports
export type {
  DataType,
  TypeSchema,
  TypeProperty,
  ValidationResult,
  ValidationError,
  CompatibilityResult,
} from './type-schema.js';

export { validateData, canConnect, inferSchema } from './type-validators.js';
