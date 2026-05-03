import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';

export function CodeField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  // Always use javascript for now
  const language = 'javascript';

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>

      <CodeMirrorEditor
        value={stringValue}
        language={language}
        onChange={(val) => onChange(field.id, val)}
        height="300px"
        placeholder={field.placeholder}
      />
    </div>
  );
}