import type { FieldProps } from './types';

export function SecretRefField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <input
        id={field.id}
        type="password"
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder ?? '••••••••'}
        className="input"
      />
      <p className="text-xs text-slate-500">Secret value will be masked</p>
    </div>
  );
}