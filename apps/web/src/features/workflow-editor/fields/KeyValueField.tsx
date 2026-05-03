import { useState } from 'react';
import type { FieldProps } from './types';

interface KeyValuePair {
  key: string;
  value: string;
}

export function KeyValueField({ field, value, onChange }: FieldProps) {
  // Parse existing value
  const initialPairs: KeyValuePair[] = (() => {
    if (!value) return [{ key: '', value: '' }];
    if (Array.isArray(value)) return value;
    if (typeof value === 'object') {
      return Object.entries(value).map(([key, val]) => ({
        key,
        value: String(val),
      }));
    }
    return [{ key: '', value: '' }];
  })();

  const [pairs, setPairs] = useState<KeyValuePair[]>(initialPairs);

  const handlePairChange = (index: number, pairField: 'key' | 'value', val: string) => {
    const updated = [...pairs];
    updated[index][pairField] = val;
    setPairs(updated);

    // Filter empty pairs and send to parent
    const nonEmpty = updated.filter(p => p.key.trim() !== '' || p.value.trim() !== '');
    onChange(field.id, nonEmpty);
  };

  const handleAdd = () => {
    setPairs([...pairs, { key: '', value: '' }]);
  };

  const handleRemove = (index: number) => {
    const updated = pairs.filter((_, i) => i !== index);
    setPairs(updated.length > 0 ? updated : [{ key: '', value: '' }]);

    const nonEmpty = updated.filter(p => p.key.trim() !== '' || p.value.trim() !== '');
    onChange(field.id, nonEmpty);
  };

  return (
    <div className="space-y-1">
      <label className="label-sm">{field.label}</label>
      <div className="space-y-2">
        {pairs.map((pair, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              value={pair.key}
              onChange={(e) => handlePairChange(index, 'key', e.target.value)}
              placeholder="Key"
              className="input flex-1"
            />
            <input
              type="text"
              value={pair.value}
              onChange={(e) => handlePairChange(index, 'value', e.target.value)}
              placeholder="Value"
              className="input flex-1"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="btn-ghost px-2 text-red-400 hover:text-red-300"
              aria-label="Remove pair"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="btn-ghost px-3 py-1 text-xs w-full border border-dashed border-slate-700"
        >
          + Add pair
        </button>
      </div>
    </div>
  );
}