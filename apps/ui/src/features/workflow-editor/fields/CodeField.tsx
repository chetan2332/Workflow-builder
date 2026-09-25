import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';

export function CodeField({ field, value, onChange }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label className="input-label">{field.label}</label>
      <CodeMirrorEditor value={v} language="javascript" onChange={val => onChange(field.id, val)} height="260px" placeholder={field.placeholder} />
    </div>
  );
}
