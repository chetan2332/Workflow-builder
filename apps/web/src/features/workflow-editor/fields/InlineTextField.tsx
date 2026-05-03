import type { FieldProps } from './types';

export function InlineTextField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <input
        id={field.id}
        type="text"
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder ?? 'Text displayed in node'}
        maxLength={20}
        className="input"
      />
      <p className="text-xs text-slate-500">
        Short text shown inside the node (max 20 chars)
      </p>
    </div>
  );
}
