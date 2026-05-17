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
        {Array.isArray(field.options) &&
          field.options.map((opt) => {
            const value = typeof opt === 'string' ? opt : opt.value;
            const label = typeof opt === 'string' ? opt : opt.label;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
      </select>
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}