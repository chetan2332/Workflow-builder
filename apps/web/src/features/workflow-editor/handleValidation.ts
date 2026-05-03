import type { HandleDataType } from './dialog/types';

export type ValidationResult = {
  valid: boolean;
  error?: string;
};

/**
 * Validates input data against handle type
 * - Default type is "any" (always valid)
 * - Permissive: extra fields are allowed
 * - Only checks required fields and basic type match
 */
export function validateHandleInput(
  data: any,
  handleType: HandleDataType,
  required: boolean = false
): ValidationResult {
  // 1. Check if required and empty
  if (required && (data === null || data === undefined || data === '')) {
    return { valid: false, error: 'Input is required' };
  }

  // 2. If empty and not required, valid
  if (data === null || data === undefined || data === '') {
    return { valid: true };
  }

  // 3. Type "any" always passes
  if (handleType === 'any') {
    return { valid: true };
  }

  // 4. Type-specific validation (permissive)
  switch (handleType) {
    case 'json':
      try {
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        if (typeof parsed === 'object' && parsed !== null) {
          return { valid: true };
        }
        return { valid: false, error: 'Must be a valid JSON object' };
      } catch (e) {
        return { valid: false, error: 'Invalid JSON format' };
      }

    case 'flow':
      // Flow handles don't carry data, just signals
      return { valid: true };

    case 'string':
      if (typeof data === 'string') {
        return { valid: true };
      }
      // Permissive: allow objects that can be stringified
      return { valid: true }; // Auto-coerce

    case 'number':
      const num = Number(data);
      if (!isNaN(num)) {
        return { valid: true };
      }
      return { valid: false, error: 'Must be a valid number' };

    case 'boolean':
      if (typeof data === 'boolean') {
        return { valid: true };
      }
      // Permissive: allow truthy/falsy values
      return { valid: true }; // Auto-coerce

    default:
      return { valid: true }; // Unknown types pass
  }
}

/**
 * Validate all inputs before execution
 */
export function validateAllInputs(
  handles: Array<{ testData?: any; type: HandleDataType; required?: boolean }>
): ValidationResult[] {
  return handles.map(handle =>
    validateHandleInput(handle.testData, handle.type, handle.required || false)
  );
}
