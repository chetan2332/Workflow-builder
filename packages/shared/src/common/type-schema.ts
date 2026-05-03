/**
 * Base data types supported by the system
 *
 * Why these types?
 * - 'any': No validation - maximum flexibility when needed
 * - 'string', 'number', 'boolean': JavaScript primitives
 * - 'object': For structured data with named properties
 * - 'array': For lists of items (can be any type)
 */
export type DataType =
  | 'any'
  | 'string'
  | 'number'
  | 'boolean'
  | 'object'
  | 'array';

/**
 * Describes the structure and constraints of data
 *
 * This is the CORE of our type system. Everything else builds on this.
 *
 * Why this structure?
 * - It's recursive (can describe nested data)
 * - It's flexible (simple types AND complex structures)
 * - It's composable (small schemas combine into big ones)
 */
export interface TypeSchema {
  /**
   * The base type of this data
   * Every piece of data starts with: what kind of thing is it?
   */
  type: DataType;

  /**
   * Is this data required? (only meaningful for object properties)
   *
   * Why optional?
   * - Only makes sense in context of object properties
   * - At root level, data either exists or doesn't
   */
  required?: boolean;

  /**
   * If type is 'array', what type are the items?
   *
   * Why TypeSchema (recursive)?
   * - Array items can be complex: array of objects, array of arrays, etc.
   * - Example: number[] → itemType: { type: 'number' }
   * - Example: User[] → itemType: { type: 'object', properties: [...] }
   */
  itemType?: TypeSchema;

  /**
   * If type is 'object', what properties does it have?
   *
   * Why TypeProperty[] not TypeSchema[]?
   * - Properties have names (keys in the object)
   * - Each property has its own schema
   * - Example: { userId: 123 } → properties: [{ name: 'userId', schema: { type: 'number' } }]
   */
  properties?: TypeProperty[];
}

/**
 * Describes a single property of an object
 *
 * What is this?
 * Objects have key-value pairs. This describes one pair.
 *
 * Why separate from TypeSchema?
 * - Properties need a NAME (the key)
 * - Properties need a SCHEMA (the value's type)
 * - Separating these makes it clear and type-safe
 */
export interface TypeProperty {
  /**
   * The name of the property (the key in the object)
   * Example: in { userId: 123 }, name is "userId"
   */
  name: string;

  /**
   * The schema describing this property's value
   * Example: in { userId: 123 }, schema is { type: 'number' }
   *
   * Why TypeSchema here?
   * - Property values can be anything: primitives, objects, arrays
   * - This enables deep nesting: { user: { profile: { tags: [...] } } }
   */
  schema: TypeSchema;
}

/**
 * Result of validating data against a schema
 *
 * Why this structure?
 * - Quick check: result.valid
 * - Detailed feedback: result.errors array
 * - Can accumulate multiple errors (better UX than failing on first error)
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * A single validation error
 *
 * Why structured errors?
 * - path: tells user WHERE the error is (e.g., "root.user.email")
 * - message: tells user WHAT is wrong
 * - expected/actual: tells user HOW to fix it
 */
export interface ValidationError {
  path: string; // Where in the data structure
  message: string; // Human-readable error
  expected?: string; // What type was expected
  actual?: string; // What type was found
}

/**
 * Result of checking if two types are compatible for connection
 *
 * Why this?
 * - When user connects two nodes, we need to check if output type matches input type
 * - If not compatible, explain WHY so user can fix it
 */
export interface CompatibilityResult {
  compatible: boolean;
  reason?: string; // If not compatible, why not?
}