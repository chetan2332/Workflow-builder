import type { FieldProps } from './types';

export function EnumField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <select
        id={field.id}
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        className="input"
      >
        <option value="">Select...</option>
        {field.options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}