import { useState, useEffect } from 'react';
import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';

export function JsonField({ field, value, onChange, onValidation }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? '');
  const [error, setError] = useState<string | null>(null);

  // Validate JSON on change
  useEffect(() => {
    if (stringValue.trim() === '') {
      setError(null);
      onValidation?.(field.id, null);
      return;
    }

    try {
      JSON.parse(stringValue);
      setError(null);
      onValidation?.(field.id, null);
    } catch (err) {
      const errorMsg = 'Invalid JSON';
      setError(errorMsg);
      onValidation?.(field.id, errorMsg);
    }
  }, [stringValue, field.id, onValidation]);

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(stringValue);
      const formatted = JSON.stringify(parsed, null, 2);
      onChange(field.id, formatted);
      setError(null);
      onValidation?.(field.id, null);
    } catch (err) {
      const errorMsg = 'Invalid JSON';
      setError(errorMsg);
      onValidation?.(field.id, errorMsg);
    }
  };

  const charCount = stringValue.length;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label htmlFor={field.id} className="label-sm">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        <button
          type="button"
          onClick={handleFormat}
          className="btn-ghost px-2 py-0.5 text-xs"
        >
          Format
        </button>
      </div>

      <CodeMirrorEditor
        value={stringValue}
        language="json"
        onChange={(val) => onChange(field.id, val)}
        height="200px"
        placeholder={field.placeholder ?? '{ }'}
      />

      <div className="flex items-center justify-between">
        {error && <p className="text-xs text-red-400">{error}</p>}
        {!error && <span />}
        <span className="text-xs text-slate-400">{charCount.toLocaleString()} characters</span>
      </div>
    </div>
  );
}