import type {
  TypeSchema,
  ValidationResult,
  ValidationError,
  CompatibilityResult,
  TypeProperty,
} from './type-schema.js';

/**
 * Validates data against schema recursively.
 *
 * Checks base type, then validates nested structures (arrays/objects).
 * Accumulates all errors instead of stopping at first failure.
 */
export function validateData(
  data: any,
  schema: TypeSchema,
  path: string = 'root',
): ValidationResult {
  const errors: ValidationError[] = [];

  if (schema.type === 'any') {
    return { valid: true, errors: [] };
  }

  if (schema.type === 'array') {
    if (!Array.isArray(data)) {
      errors.push({
        path,
        message: `Expected array, got ${typeof data}`,
        expected: 'array',
        actual: typeof data,
      });
      return { valid: false, errors };
    }

    if (schema.itemType) {
      data.forEach((item, index) => {
        const itemResult = validateData(item, schema.itemType!, `${path}[${index}]`);
        errors.push(...itemResult.errors);
      });
    }

    return { valid: errors.length === 0, errors };
  }

  if (schema.type === 'object') {
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push({
        path,
        message: `Expected object, got ${Array.isArray(data) ? 'array' : typeof data}`,
        expected: 'object',
        actual: Array.isArray(data) ? 'array' : typeof data,
      });
      return { valid: false, errors };
    }

    if (schema.properties) {
      for (const prop of schema.properties) {
        const propPath = `${path}.${prop.name}`;

        if (prop.schema.required && !(prop.name in data)) {
          errors.push({
            path: propPath,
            message: `Required property missing`,
            expected: `property '${prop.name}'`,
            actual: 'undefined',
          });
          continue;
        }

        if (prop.name in data) {
          const propResult = validateData(data[prop.name], prop.schema, propPath);
          errors.push(...propResult.errors);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // Primitives
  const actualType = typeof data;
  if (actualType !== schema.type) {
    errors.push({
      path,
      message: `Type mismatch`,
      expected: schema.type,
      actual: actualType,
    });
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Check if output type can connect to input type.
 *
 * Input type must be subset of output type (output provides at least what input needs).
 */
export function canConnect(
  outputType: TypeSchema,
  inputType: TypeSchema,
): CompatibilityResult {
  if (inputType.type === 'any' || outputType.type === 'any') {
    return { compatible: true };
  }

  if (outputType.type !== inputType.type) {
    return {
      compatible: false,
      reason: `Type mismatch: output is ${outputType.type}, input expects ${inputType.type}`,
    };
  }

  if (outputType.type === 'array') {
    if (outputType.itemType && inputType.itemType) {
      return canConnect(outputType.itemType, inputType.itemType);
    }
    return { compatible: true };
  }

  if (outputType.type === 'object') {
    if (inputType.properties) {
      for (const inputProp of inputType.properties) {
        if (inputProp.schema.required) {
          const outputProp = outputType.properties?.find((p) => p.name === inputProp.name);

          if (!outputProp) {
            return {
              compatible: false,
              reason: `Output missing required property: ${inputProp.name}`,
            };
          }

          const propCheck = canConnect(outputProp.schema, inputProp.schema);
          if (!propCheck.compatible) {
            return {
              compatible: false,
              reason: `Property '${inputProp.name}': ${propCheck.reason}`,
            };
          }
        }
      }
    }

    return { compatible: true };
  }

  return { compatible: true };
}

/**
 * Infer schema from sample data.
 *
 * Recursively analyzes data structure to generate matching TypeSchema.
 * Limitation: empty arrays use 'any', mixed arrays only check first item.
 */
export function inferSchema(data: any): TypeSchema {
  if (data === null || data === undefined) {
    return { type: 'any' };
  }

  if (Array.isArray(data)) {
    const schema: TypeSchema = { type: 'array' };
    schema.itemType = data.length > 0 ? inferSchema(data[0]) : { type: 'any' };
    return schema;
  }

  if (typeof data === 'object') {
    const properties: TypeProperty[] = [];

    for (const [key, value] of Object.entries(data)) {
      properties.push({
        name: key,
        schema: {
          ...inferSchema(value),
          required: value !== null && value !== undefined,
        },
      });
    }

    return { type: 'object', properties };
  }

  return { type: typeof data as any };
}