import type { ActionField } from '../../../nodeConfigSchema';

// Field values (config field values)
export type FieldValues = Record<string, any>;

// Validation errors per field
export type ValidationErrors = Record<string, string | null>;

// Execution state
export type ExecutionState = {
  status: 'idle' | 'running' | 'success' | 'error';
  startTime?: number;
  duration?: number;
  error?: string;
};

// Handle data types
export type HandleDataType = 'any' | 'json' | 'flow' | 'string' | 'number' | 'boolean';

// Handle definition with runtime data
export type HandleDefinition = {
  id: string;                  // "in-1", "out-true"
  kind: 'input' | 'output';
  type: HandleDataType;        // Type for validation
  label: string;               // User-visible label
  side: 'left' | 'right' | 'top' | 'bottom';
  required?: boolean;          // For validation

  // Runtime data (for testing/execution)
  testData?: any;              // User-editable test input
  outputData?: any;            // Execution result
  connected?: boolean;         // Visual indicator
  fired?: boolean;             // For execution (outputs only)
  validationError?: string;    // Validation message
};

// Dialog state
export type DialogState = {
  // Config field values
  values: FieldValues;

  // Validation errors per field
  errors: ValidationErrors;

  // Handle definitions
  handles: {
    inputs: HandleDefinition[];
    outputs: HandleDefinition[];
  };

  // Active tab
  activeTab: string; // 'handles' | 'logic' | 'advanced' etc.

  // Execution state
  execution: ExecutionState;

  // Accordion/expansion state
  expandedInputs: Set<string>;   // Which input handles are expanded
  expandedOutputs: Set<string>;  // Which output handles are expanded
};
