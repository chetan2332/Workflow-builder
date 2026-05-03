import type { FieldProps } from './types';

// Mock files for now - will be replaced with API call
const MOCK_FILES = [
  { value: '', label: 'Choose file...' },
  { value: 'file-1', label: 'document.txt' },
  { value: 'file-2', label: 'data.csv' },
  { value: 'file-3', label: 'config.json' },
];

export function FileRefField({ field, value, onChange }: FieldProps) {
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
        {MOCK_FILES.map((file) => (
          <option key={file.value} value={file.value}>
            {file.label}
          </option>
        ))}
      </select>
    </div>
  );
}