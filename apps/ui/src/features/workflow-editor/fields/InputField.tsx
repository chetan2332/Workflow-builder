import { useState } from 'react';
import type { FieldProps } from './types';
import type { TypeSchema } from '@n8n-project/shared';
import { inferSchema } from '@n8n-project/shared';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { SchemaBuilder } from '../dialog/SchemaBuilder';

export function InputField({ field, value, onChange }: FieldProps) {
  const inputValue = value as { payload?: unknown; schema?: TypeSchema } | undefined;

  const [payloadString, setPayloadString] = useState(() => {
    if (inputValue?.payload) {
      return typeof inputValue.payload === 'string'
        ? inputValue.payload
        : JSON.stringify(inputValue.payload, null, 2);
    }
    return '';
  });

  const [schema, setSchema] = useState<TypeSchema>(() => inputValue?.schema ?? { type: 'any' });
  const [jsonError, setJsonError] = useState<string | null>(null);

  const emit = (ps: string, sc: TypeSchema) => {
    let parsed: unknown = null;
    try {
      if (ps.trim()) { parsed = JSON.parse(ps); setJsonError(null); }
      else setJsonError(null);
    } catch {
      setJsonError('Invalid JSON');
      parsed = ps;
    }
    onChange(field.id, { payload: parsed, schema: sc });
  };

  const handlePayload = (v: string) => { setPayloadString(v); emit(v, schema); };
  const handleSchema = (s: TypeSchema) => { setSchema(s); emit(payloadString, s); };

  const handleInfer = () => {
    try {
      const inferred = inferSchema(JSON.parse(payloadString));
      setSchema(inferred);
      emit(payloadString, inferred);
    } catch { setJsonError('Invalid JSON'); }
  };

  const handleFormat = () => {
    try { setPayloadString(JSON.stringify(JSON.parse(payloadString), null, 2)); setJsonError(null); }
    catch { setJsonError('Invalid JSON'); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <label className="input-label">{field.label}</label>
        {field.description && <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginTop: 2 }}>{field.description}</p>}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>Sample payload</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={handleFormat} style={{ fontSize: '0.6875rem', padding: '2px 6px' }}>Format</button>
        </div>
        <CodeMirrorEditor value={payloadString} language="json" onChange={handlePayload} height="140px" placeholder='{ "example": "data" }' />
        {jsonError && <p style={{ fontSize: '0.6875rem', color: 'var(--danger)' }}>{jsonError}</p>}
      </div>

      <button type="button" className="btn btn-ghost btn-sm" onClick={handleInfer} style={{ alignSelf: 'flex-start', border: '1px solid var(--border)' }}>
        Infer schema from payload
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>Input schema</span>
        <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--border)', backgroundColor: 'var(--surface-2)' }}>
          <SchemaBuilder schema={schema} onChange={handleSchema} />
        </div>
      </div>
    </div>
  );
}
