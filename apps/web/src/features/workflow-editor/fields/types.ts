import type { ActionField } from '../../../nodeConfigSchema';

export interface FieldProps {
  field: ActionField;
  value: any;
  onChange: (id: string, value: any) => void;
  onValidation?: (id: string, error: string | null) => void;
}