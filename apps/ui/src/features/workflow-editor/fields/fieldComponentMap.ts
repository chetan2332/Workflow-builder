import type { ConfigField } from '@n8n-project/shared';
import type { FieldProps } from '../fields/types';
import { BooleanField }       from '../fields/BooleanField';
import { StringField }        from '../fields/StringField';
import { NumberField }        from '../fields/NumberField';
import { SelectField }        from '../fields/SelectField';
import { TextareaField }      from '../fields/TextareaField';
import { CodeField }          from '../fields/CodeField';
import { JsonField }          from '../fields/JsonField';
import { KeyValueField }      from '../fields/KeyValueField';
import { FileField }          from '../fields/FileField';
import { CredentialRefField } from '../fields/CredentialRefField';
import { InputField }         from '../fields/InputField';
import { CasesField }         from '../fields/CasesField';

type FC = React.ComponentType<FieldProps>;

export const FIELD_COMPONENTS: Record<ConfigField['type'], FC> = {
  boolean:       BooleanField,
  string:        StringField,
  number:        NumberField,
  select:        SelectField,
  textarea:      TextareaField,
  code:          CodeField,
  json:          JsonField,
  keyValue:      KeyValueField,
  file:          FileField,
  credentialRef: CredentialRefField,
  input:         InputField,
  cases:         CasesField,
};

export function getFieldComponent(type: ConfigField['type']): FC | null {
  return FIELD_COMPONENTS[type] ?? null;
}
