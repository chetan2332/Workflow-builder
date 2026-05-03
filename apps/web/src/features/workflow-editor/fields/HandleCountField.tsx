import type { FieldProps } from './types';

export function HandleCountField({ field, value, onChange }: FieldProps) {
  const numValue = typeof value === 'number' ? value : Number(value ?? field.defaultValue ?? 1);

  return (
    <div className="space-y-1">
      <label htmlFor={field.id} className="label-sm">
        {field.label}
      </label>
      <input
        id={field.id}
        type="number"
        value={numValue}
        onChange={(e) => onChange(field.id, Number(e.target.value))}
        min={field.min ?? 1}
        max={field.max}
        className="input"
      />
      <p className="text-xs text-slate-500">Number of dynamic handles to create</p>
    </div>
  );
}
