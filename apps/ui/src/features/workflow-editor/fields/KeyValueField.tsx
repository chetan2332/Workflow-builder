import { useState } from 'react';
import type { FieldProps } from './types';
import { Trash2 } from 'lucide-react';

interface Pair { key: string; value: string; }

export function KeyValueField({ field, value, onChange }: FieldProps) {
  const init: Pair[] = (() => {
    if (!value) return [{ key: '', value: '' }];
    if (Array.isArray(value)) return value as Pair[];
    if (typeof value === 'object' && value !== null) return Object.entries(value as Record<string, unknown>).map(([k, v]) => ({ key: k, value: String(v) }));
    return [{ key: '', value: '' }];
  })();

  const [pairs, setPairs] = useState<Pair[]>(init);

  const update = (updated: Pair[]) => {
    setPairs(updated);
    onChange(field.id, updated.filter(p => p.key.trim() || p.value.trim()));
  };

  const change = (i: number, f: keyof Pair, v: string) => {
    update(pairs.map((p, idx) => idx === i ? { ...p, [f]: v } : p));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label className="input-label">{field.label}</label>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <input className="input" placeholder="Key" value={p.key} onChange={e => change(i, 'key', e.target.value)} style={{ flex: 1 }} />
          <input className="input" placeholder="Value" value={p.value} onChange={e => change(i, 'value', e.target.value)} style={{ flex: 1 }} />
          <button type="button" className="btn-icon" onClick={() => update(pairs.length > 1 ? pairs.filter((_, idx) => idx !== i) : [{ key: '', value: '' }])}>
            <Trash2 size={13} />
          </button>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', border: '1px dashed var(--border)' }} onClick={() => update([...pairs, { key: '', value: '' }])}>
        + Add row
      </button>
    </div>
  );
}
