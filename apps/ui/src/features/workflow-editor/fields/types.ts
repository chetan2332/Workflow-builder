import type { ConfigField } from '@n8n-project/shared';

export interface FieldProps {
  field: ConfigField;
  value: unknown;
  onChange: (id: string, value: unknown) => void;
  onValidation?: (id: string, error: string | null) => void;
}
