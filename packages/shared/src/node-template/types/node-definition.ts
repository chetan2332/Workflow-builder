import type { Handle } from './handle';
import type { UIConfig } from './ui';
import type { TypeSchema } from '../../common/type-schema';

/**
 * Node Definition - Single source of truth for node structure
 *
 * Used by:
 * - Frontend: Render UI, validate user input
 * - Backend: Validate config before execution
 */
export type NodeDefinition = {
  // Identity
  type: string;           // e.g., "trigger.start", "code.http", "flow.if"
  version: number;        // Versioning support
  category: 'TRIGGER' | 'CODE' | 'FLOW';

  // Metadata
  label: string;
  description: string;
  icon?: string;
  shape?: 'rectangle' | 'circle' | 'diamond' | 'hexagon';  // Visual shape in canvas

  // Structure
  inputHandles: Handle[];
  outputHandles: Handle[];
  configHandles?: Handle[];        // Optional config handles (for special nodes)
  dynamicHandles?: {         // Are handles user-modifiable?
    inputs: boolean;         // Can user add/remove input handles?
    outputs: boolean;        // Can user add/remove output handles?
  };

  // Config validation schema (validates the entire config object)
  configSchema: TypeSchema;

  // UI metadata (for frontend rendering)
  ui: UIConfig;
};
