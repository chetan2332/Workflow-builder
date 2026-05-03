/**
 * Field-level validator for config fields
 * Runs in backend during NodeFactory.create()
 */
export type FieldValidator = {
  type: 'enum' | 'regex' | 'range' | 'custom';

  // For enum validation (e.g., LLM providers: ["openai", "anthropic", "custom"])
  enum?: string[];

  // For regex validation
  pattern?: string;
  message?: string;

  // For range validation (numbers)
  min?: number;
  max?: number;

  // For custom validation
  validate?: (value: any, config?: any) => boolean | string;
};

/**
 * Configuration field definition
 * Describes a single field in a node's configuration UI
 */
export type ConfigField = {
  id: string;
  type: 'string' | 'number' | 'boolean' | 'select' | 'textarea' | 'code' | 'json' | 'keyValue' | 'file' | 'credentialRef';
  label: string;
  required: boolean;
  default?: any;
  placeholder?: string;
  description?: string;

  // Optional validation (for restricted fields)
  validator?: FieldValidator;

  // Dynamic options (for select fields)
  options?: string[] | 'dynamic';

  // Conditional display
  showWhen?: string;  // JavaScript expression

  // Special features
  supportsInterpolation?: boolean;  // Allows {{input.field}}

  // For file/multi-select
  multiple?: boolean;

  // For code fields
  language?: 'javascript' | 'python';

  // For number fields
  min?: number;
  max?: number;
  step?: number;
};

/**
 * Tab configuration
 * Groups related fields together in UI
 */
export type TabConfig = {
  id: string;
  label: string;
  fields: ConfigField[];
  note?: string;
};

/**
 * Panel configuration
 * Defines what appears in left/center/right panels of node dialog
 */
export type PanelConfig = {
  title: string;
  description?: string;
  // Component indicates what React component to render in this panel
  // - 'HandleList': Render list of input/output handles
  // - 'SchemaBuilder': Render schema editor UI
  // - 'OutputSelector': Render output handle selector/toggle
  // Frontend implementation detail - backend doesn't need this
  component?: 'HandleList' | 'SchemaBuilder' | 'OutputSelector';
  tabs?: TabConfig[];
};
