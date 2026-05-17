/**
 * Field Component Map
 *
 * Maps ConfigField.type to React component
 * Uses Component Map Object pattern to eliminate switch case
 */

import type { ConfigField } from '@n8n-project/shared';
import type { FieldProps } from './types';

// Core field components matching ConfigField types
import { BooleanField } from './BooleanField';
import { StringField } from './StringField';
import { NumberField } from './NumberField';
import { SelectField } from './SelectField';
import { TextareaField } from './TextareaField';
import { CodeField } from './CodeField';
import { JsonField } from './JsonField';
import { KeyValueField } from './KeyValueField';
import { FileField } from './FileField';
import { CredentialRefField } from './CredentialRefField';
import { InputField } from './InputField';
import { CasesField } from './CasesField';

type FieldComponent = React.ComponentType<FieldProps>;

/**
 * Component map for ConfigField types
 * Add new field types here to extend the system
 */
export const FIELD_COMPONENTS: Record<ConfigField['type'], FieldComponent> = {
  boolean: BooleanField,
  string: StringField,
  number: NumberField,
  select: SelectField,
  textarea: TextareaField,
  code: CodeField,
  json: JsonField,
  keyValue: KeyValueField,
  file: FileField,
  credentialRef: CredentialRefField,
  input: InputField,
  cases: CasesField,
};

/**
 * Get field component for a given field type
 */
export function getFieldComponent(type: ConfigField['type']): FieldComponent | null {
  const Component = FIELD_COMPONENTS[type];

  if (!Component) {
    console.warn(`Unknown field type: ${type}`);
    return null;
  }

  return Component;
}
