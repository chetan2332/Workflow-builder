import { useState } from 'react';
import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';

interface CaseItem {
  label: string;
  condition: string;
}

const DEFAULT_CASE: CaseItem = { label: '', condition: '' };

export function CasesField({ field, value, onChange }: FieldProps) {
  const initial: CaseItem[] = Array.isArray(value) && value.length > 0
    ? value
    : [{ ...DEFAULT_CASE }, { ...DEFAULT_CASE }];

  const [cases, setCases] = useState<CaseItem[]>(initial);

  const update = (updated: CaseItem[]) => {
    setCases(updated);
    onChange(field.id, updated);
  };

  const handleChange = (index: number, key: keyof CaseItem, val: string) => {
    const updated = cases.map((c, i) => i === index ? { ...c, [key]: val } : c);
    update(updated);
  };

  const handleAdd = () => update([...cases, { ...DEFAULT_CASE }]);

  const handleRemove = (index: number) => {
    if (cases.length <= 1) return;
    update(cases.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {cases.map((item, index) => (
        <div key={index} className="rounded-lg border border-slate-700 bg-slate-900 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={item.label}
              onChange={(e) => handleChange(index, 'label', e.target.value)}
              placeholder={`Case ${index + 1} label`}
              className="input flex-1 mr-2"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              disabled={cases.length <= 1}
              className="btn-ghost px-2 text-red-400 hover:text-red-300 disabled:opacity-30"
              aria-label="Remove case"
            >
              ×
            </button>
          </div>
          <div className="space-y-1">
            <span className="label-sm text-slate-400">Condition</span>
            <CodeMirrorEditor
              value={item.condition}
              language="javascript"
              onChange={(val) => handleChange(index, 'condition', val)}
              height="80px"
              placeholder="input.status === 'pending'"
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="btn-ghost px-3 py-1 text-xs w-full border border-dashed border-slate-700"
      >
        + Add case
      </button>
    </div>
  );
}
