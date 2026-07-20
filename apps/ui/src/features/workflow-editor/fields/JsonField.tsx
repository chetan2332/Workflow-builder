import { useState, useEffect } from 'react';
import type { FieldProps } from './types';
import { CodeMirrorEditor } from './CodeMirrorEditor';

export function JsonField({ field, value, onChange, onValidation }: FieldProps) {
  const v = String(value ?? field.default ?? '');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!v.trim()) { setError(null); onValidation?.(field.id, null); return; }
    try { JSON.parse(v); setError(null); onValidation?.(field.id, null); }
    catch { setError('Invalid JSON'); onValidation?.(field.id, 'Invalid JSON'); }
  }, [v, field.id, onValidation]);

  const handleFormat = () => {
    try { onChange(field.id, JSON.stringify(JSON.parse(v), null, 2)); setError(null); }
    catch { setError('Invalid JSON'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <label className="input-label">
          {field.label}{field.required && <span style={{ color: 'var(--danger)', marginLeft: 3 }}>*</span>}
        </label>
        <button type="button" className="btn btn-ghost btn-sm" onClick={handleFormat} style={{ fontSize: '0.6875rem', padding: '2px 6px' }}>Format</button>
      </div>
      <CodeMirrorEditor value={v} language="json" onChange={val => onChange(field.id, val)} height="200px" placeholder={field.placeholder ?? '{ }'} />
      {error && <p style={{ fontSize: '0.6875rem', color: 'var(--danger)' }}>{error}</p>}
    </div>
  );
}
