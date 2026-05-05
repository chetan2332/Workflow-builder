import type { FieldProps } from './types';

/**
 * TextareaField - multiline text input
 * Maps to ConfigField.type = 'textarea'
 */
export function TextareaField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.default ?? '');

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
        {field.required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <textarea
        id={field.id}
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className="input h-24 resize-none"
      />
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}