import type { FieldProps } from './types';

/**
 * StringField - basic text input
 * Maps to ConfigField.type = 'string'
 */
export function StringField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.default ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type="text"
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className="input"
      />
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}