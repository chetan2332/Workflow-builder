import type { FieldProps } from './types';

/**
 * SelectField - dropdown selection
 * Renamed from EnumField to match new ConfigField.type = 'select'
 */
export function SelectField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.default ?? '');

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
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}