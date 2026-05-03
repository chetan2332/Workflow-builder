/**
 * JSON-serializable value types used throughout the system
 */

export type InputValue =
  | string
  | number
  | boolean
  | null
  | InputObject
  | InputArray;

export interface InputObject {
  [key: string]: InputValue;
}

export interface InputArray extends Array<InputValue> {}

// Output values are same as input values
export type OutputValue = InputValue;
