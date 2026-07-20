import { useState } from 'react';
import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { Trash2 } from 'lucide-react';

interface Case { label: string; condition: string; }

export function CasesField({ field, value, onChange }: FieldProps) {
  const init: Case[] = Array.isArray(value) && value.length > 0
    ? value as Case[]
    : [{ label: '', condition: '' }, { label: '', condition: '' }];

  const [cases, setCases] = useState<Case[]>(init);

  const update = (updated: Case[]) => {
    setCases(updated);
    onChange(field.id, updated);
  };

  const change = (i: number, k: keyof Case, v: string) => update(cases.map((c, idx) => idx === i ? { ...c, [k]: v } : c));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label className="input-label">{field.label}</label>
      {cases.map((item, i) => (
        <div key={i} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input className="input" placeholder={`Case ${i + 1} label`} value={item.label} onChange={e => change(i, 'label', e.target.value)} style={{ flex: 1 }} />
            <button type="button" className="btn-icon" disabled={cases.length <= 1} onClick={() => cases.length > 1 && update(cases.filter((_, idx) => idx !== i))}>
              <Trash2 size={13} />
            </button>
          </div>
          <div>
            <label className="input-label" style={{ marginBottom: 4 }}>Condition</label>
            <CodeMirrorEditor value={item.condition} language="javascript" onChange={v => change(i, 'condition', v)} height="72px" placeholder="input.status === 'active'" />
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start', border: '1px dashed var(--border)' }} onClick={() => update([...cases, { label: '', condition: '' }])}>
        + Add case
      </button>
    </div>
  );
}
