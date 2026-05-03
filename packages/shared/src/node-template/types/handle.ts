import type { TypeSchema } from '../../common/type-schema';

/**
 * Handle represents an input, output, or config connection point on a node
 */
export type Handle = {
  id: string;
  label: string;
  type: 'input' | 'output' | 'config';
  schema: TypeSchema;          // Runtime data type (e.g., string, object)
  data?: any;                  // Optional data attached to handle
  fixed: boolean;              // Can user add/remove this handle?
  schemaEditable: boolean;     // Can user edit the schema?
};
