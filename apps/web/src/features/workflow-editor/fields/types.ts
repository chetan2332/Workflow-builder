import type { ConfigField } from '@n8n-project/shared';

export interface FieldProps {
  field: ConfigField;
  value: any;
  onChange: (id: string, value: any) => void;
  onValidation?: (id: string, error: string | null) => void;
}