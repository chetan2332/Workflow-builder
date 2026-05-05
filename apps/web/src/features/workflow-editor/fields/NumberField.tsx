import type { FieldProps } from './types';

/**
 * NumberField - numeric input
 * Maps to ConfigField.type = 'number'
 */
export function NumberField({ field, value, onChange }: FieldProps) {
  const numValue = value ?? field.default ?? '';

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={field.id}
        type="number"
        value={numValue}
        onChange={(e) => onChange(field.id, Number(e.target.value))}
        placeholder={field.placeholder}
        min={field.min}
        max={field.max}
        step={field.step}
        className="input"
      />
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}