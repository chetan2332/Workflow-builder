import type { FieldProps } from './types';

export function BooleanField({ field, value, onChange }: FieldProps) {
  const boolValue = typeof value === 'boolean' ? value : value === 'true';

  return (
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        id={field.id}
        checked={boolValue}
        onChange={(e) => onChange(field.id, e.target.checked)}
        className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"
      />
      <label htmlFor={field.id} className="label-sm cursor-pointer">
        {field.label}
      </label>
    </div>
  );
}