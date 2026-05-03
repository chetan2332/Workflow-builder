import { useEffect } from 'react';
import type { FieldProps } from './types';

export function TextField({ field, value, onChange, onValidation }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');

  // Validate maxLength
  useEffect(() => {
    if (field.max && stringValue.length > field.max) {
      const errorMsg = `Maximum length is ${field.max} characters`;
      onValidation?.(field.id, errorMsg);
    } else {
      onValidation?.(field.id, null);
    }
  }, [stringValue, field.id, field.max, onValidation]);

  const charCount = stringValue.length;
  const hasError = field.max && charCount > field.max;

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        id={field.id}
        value={stringValue}
        onChange={(e) => onChange(field.id, e.target.value)}
        placeholder={field.placeholder}
        className={`input h-32 resize-y ${hasError ? 'border-red-500' : ''}`}
      />
      <div className="flex items-center justify-between">
        {hasError && (
          <p className="text-xs text-red-400">Maximum length is {field.max} characters</p>
        )}
        {!hasError && <span />}
        {field.max && (
          <span className={`text-xs ${hasError ? 'text-red-400' : 'text-slate-400'}`}>
            {charCount.toLocaleString()} / {field.max.toLocaleString()}
          </span>
        )}
        {!field.max && charCount > 0 && (
          <span className="text-xs text-slate-400">{charCount.toLocaleString()} characters</span>
        )}
      </div>
    </div>
  );
}