import type { FieldProps } from './types';

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

export function HttpMethodField({ field, value, onChange }: FieldProps) {
  const stringValue = String(value ?? field.defaultValue ?? 'GET');

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
        {HTTP_METHODS.map((method) => (
          <option key={method} value={method}>
            {method}
          </option>
        ))}
      </select>
    </div>
  );
}