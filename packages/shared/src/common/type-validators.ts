import type {
  TypeSchema,
  ValidationResult,
  ValidationError,
  CompatibilityResult,
  TypeProperty,
} from './type-schema.js';

/**
 * Validates data against a schema
 *
 * HOW IT WORKS:
 * 1. Check if base type matches (string vs number, etc.)
 * 2. If array, validate each item recursively
 * 3. If object, validate each property recursively
 * 4. Accumulate all errors (don't stop at first error)
 *
 * WHY RECURSIVE?
 * - Nested data requires nested validation
 * - Example: validating array of objects requires:
 *   a) Check it's an array
 *   b) For each item, check it's an object
 *   c) For each item's property, check property type
 *
 * @param data - The actual data to validate
 * @param schema - The expected structure
 * @param path - Current path in data (for error messages)
 * @returns ValidationResult with any errors found
 */
export function validateData(
  data: any,
  schema: TypeSchema,
  path: string = 'root',
): ValidationResult {
  const errors: ValidationError[] = [];

  // CASE 1: 'any' type - no validation needed
  // Why? 'any' means "accept anything" - maximum flexibility
  if (schema.type === 'any') {
    return { valid: true, errors: [] };
  }

  // CASE 2: Array validation
  if (schema.type === 'array') {
    // First: is it actually an array?
    if (!Array.isArray(data)) {
      errors.push({
        path,
        message: `Expected array, got ${typeof data}`,
        expected: 'array',
        actual: typeof data,
      });
      return { valid: false, errors };
    }

    // Second: validate each item (if itemType specified)
    // Why check itemType existence? It's optional - arrays without item validation allowed
    if (schema.itemType) {
      data.forEach((item, index) => {
        // Recursive call! Validate each array item
        const itemResult = validateData(
          item,
          schema.itemType!,
          `${path}[${index}]`,
        );
        // Accumulate errors from nested validation
        errors.push(...itemResult.errors);
      });
    }

    return { valid: errors.length === 0, errors };
  }

  // CASE 3: Object validation
  if (schema.type === 'object') {
    // First: is it actually an object?
    // Why these checks? null is typeof 'object', arrays are objects
    if (typeof data !== 'object' || data === null || Array.isArray(data)) {
      errors.push({
        path,
        message: `Expected object, got ${Array.isArray(data) ? 'array' : typeof data}`,
        expected: 'object',
        actual: Array.isArray(data) ? 'array' : typeof data,
      });
      return { valid: false, errors };
    }

    // Second: validate properties (if specified)
    if (schema.properties) {
      for (const prop of schema.properties) {
        const propPath = `${path}.${prop.name}`;

        // Check required properties
        // Why check required? Optional properties can be missing
        if (prop.schema.required && !(prop.name in data)) {
          errors.push({
            path: propPath,
            message: `Required property missing`,
            expected: `property '${prop.name}'`,
            actual: 'undefined',
          });
          continue;
        }

        // If property exists, validate its value
        // Why check existence? Don't validate missing optional properties
        if (prop.name in data) {
          // Recursive call! Validate nested property
          const propResult = validateData(
            data[prop.name],
            prop.schema,
            propPath,
          );
          errors.push(...propResult.errors);
        }
      }
    }

    return { valid: errors.length === 0, errors };
  }

  // CASE 4: Primitive types (string, number, boolean)
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
 * Checks if output type can connect to input type
 *
 * WHAT IS THIS FOR?
 * When user drags edge from node A output to node B input,
 * we need to check if the data types are compatible.
 *
 * WHY?
 * - Catch errors early (at connection time, not runtime)
 * - Better UX (immediate feedback)
 * - Prevent invalid workflows
 *
 * COMPATIBILITY RULES:
 * 1. 'any' is compatible with everything (both ways)
 * 2. Same types are compatible (string → string)
 * 3. For arrays: item types must be compatible (recursive!)
 * 4. For objects: output must have all required input properties
 *
 * @param outputType - Type of data coming from output handle
 * @param inputType - Type of data expected by input handle
 * @returns Whether connection is valid and why (if not)
 */
export function canConnect(
  outputType: TypeSchema,
  inputType: TypeSchema,
): CompatibilityResult {
  // RULE 1: 'any' input accepts anything
  // Why? 'any' means no validation - maximum flexibility
  if (inputType.type === 'any') {
    return { compatible: true };
  }

  // RULE 2: 'any' output can go anywhere
  // Why? If we don't know output type, let it through (runtime will handle it)
  if (outputType.type === 'any') {
    return { compatible: true };
  }

  // RULE 3: Base types must match
  // Why? Can't connect number to string - data would be wrong type
  if (outputType.type !== inputType.type) {
    return {
      compatible: false,
      reason: `Type mismatch: output is ${outputType.type}, input expects ${inputType.type}`,
    };
  }

  // RULE 4: For arrays, check item type compatibility (recursive)
  // Why recursive? Array items might be complex (objects, nested arrays)
  if (outputType.type === 'array') {
    // If both have itemType defined, check compatibility
    if (outputType.itemType && inputType.itemType) {
      // Recursive call! Check if array items are compatible
      return canConnect(outputType.itemType, inputType.itemType);
    }
    // If one doesn't specify itemType, allow connection (no constraint)
    return { compatible: true };
  }

  // RULE 5: For objects, check property compatibility
  // Why? Input might require certain properties that output doesn't provide
  if (outputType.type === 'object') {
    // Check if output has all required input properties
    if (inputType.properties) {
      for (const inputProp of inputType.properties) {
        // Only check required properties
        if (inputProp.schema.required) {
          // Does output have this property?
          const outputProp = outputType.properties?.find(
            (p) => p.name === inputProp.name,
          );

          if (!outputProp) {
            return {
              compatible: false,
              reason: `Output missing required property: ${inputProp.name}`,
            };
          }

          // Property exists - check if types are compatible (recursive!)
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

  // Primitives already checked (same type) - compatible
  return { compatible: true };
}

/**
 * Infers a schema from sample data
 *
 * WHAT IS THIS?
 * Given actual data, figure out what schema describes it.
 *
 * WHY?
 * - Save user time: paste JSON, get schema automatically
 * - Prevent errors: schema matches actual data structure
 * - Learn by example: user sees schema inferred from their data
 *
 * HOW IT WORKS:
 * 1. Look at data type (typeof, Array.isArray)
 * 2. For objects: recursively infer each property
 * 3. For arrays: look at first item to infer item type
 * 4. Assume non-null values are required
 *
 * LIMITATIONS:
 * - Empty arrays: can't infer item type
 * - null values: can't infer intended type
 * - Mixed arrays: only uses first item
 *
 * @param data - Sample data to analyze
 * @returns Inferred schema describing the data
 */
export function inferSchema(data: any): TypeSchema {
  // Null or undefined → 'any' (can't infer)
  if (data === null || data === undefined) {
    return { type: 'any' };
  }

  // Array
  if (Array.isArray(data)) {
    const schema: TypeSchema = { type: 'array' };

    // If array has items, infer item type from first item
    // Why first item? Assumes array is homogeneous (all same type)
    // Limitation: mixed-type arrays won't be fully described
    if (data.length > 0) {
      schema.itemType = inferSchema(data[0]);
    } else {
      // Empty array - can't infer, use 'any'
      schema.itemType = { type: 'any' };
    }

    return schema;
  }

  // Object
  if (typeof data === 'object') {
    const properties: TypeProperty[] = [];

    // Infer schema for each property (recursive!)
    for (const [key, value] of Object.entries(data)) {
      properties.push({
        name: key,
        // Recursive call! Infer nested structure
        schema: {
          ...inferSchema(value),
          // Assume non-null values are required
          // Why? Present values likely important
          // User can change to optional after inference
          required: value !== null && value !== undefined,
        },
      });
    }

    return { type: 'object', properties };
  }

  // Primitives (string, number, boolean)
  return { type: typeof data as any };
}