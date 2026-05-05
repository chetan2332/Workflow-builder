import type { FieldProps } from './types';

// Mock files for now - will be replaced with API call
const MOCK_FILES = [
  { value: '', label: 'Choose file...' },
  { value: 'file-1', label: 'document.txt' },
  { value: 'file-2', label: 'data.csv' },
  { value: 'file-3', label: 'config.json' },
];

/**
 * FileField - file selection/upload
 * Renamed from FileRefField to match new ConfigField.type = 'file'
 */
export function FileField({ field, value, onChange }: FieldProps) {
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
        {MOCK_FILES.map((file) => (
          <option key={file.value} value={file.value}>
            {file.label}
          </option>
        ))}
      </select>
      {field.description && (
        <p className="text-xs text-slate-400">{field.description}</p>
      )}
    </div>
  );
}