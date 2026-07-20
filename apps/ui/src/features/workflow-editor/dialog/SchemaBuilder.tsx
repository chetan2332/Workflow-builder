import type { TypeSchema, DataType } from '@n8n-project/shared';

const TYPE_OPTIONS: { value: DataType; label: string }[] = [
  { value: 'any',     label: 'Any' },
  { value: 'string',  label: 'String' },
  { value: 'number',  label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'object',  label: 'Object' },
  { value: 'array',   label: 'Array' },
];

interface Props {
  schema: TypeSchema;
  onChange: (s: TypeSchema) => void;
  label?: string;
  showRequired?: boolean;
  level?: number;
}

export function SchemaBuilder({ schema, onChange, label, showRequired = false, level = 0 }: Props) {
  const handleTypeChange = (type: DataType) => {
    const updated: TypeSchema = { type };
    if (schema.required !== undefined) updated.required = schema.required;
    if (type === 'array')  updated.itemType = { type: 'any' };
    if (type === 'object') updated.properties = [];
    onChange(updated);
  };

  return (
    <div style={{ marginLeft: level * 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        {label && <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-1)' }}>{label}</span>}
        <select
          value={schema.type}
          onChange={e => handleTypeChange(e.target.value as DataType)}
          className="input"
          style={{ width: 140, fontSize: '0.75rem', padding: '3px 8px' }}
        >
          {TYPE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {showRequired && (
          <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--text-2)', whiteSpace: 'nowrap' }}>
            <input type="checkbox" checked={schema.required ?? false}
              onChange={e => onChange({ ...schema, required: e.target.checked })}
              style={{ accentColor: 'var(--accent)', cursor: 'pointer' }} />
            Required
          </label>
        )}
      </div>

      {schema.type === 'array' && (
        <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12, marginTop: 4 }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginBottom: 4 }}>Array items:</p>
          <SchemaBuilder schema={schema.itemType ?? { type: 'any' }} onChange={itemType => onChange({ ...schema, itemType })} level={level + 1} />
        </div>
      )}

      {schema.type === 'object' && (
        <div style={{ borderLeft: '2px solid var(--border)', paddingLeft: 12, marginTop: 4 }}>
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', marginBottom: 6 }}>Properties:</p>
          {schema.properties?.map((prop, i) => (
            <div key={i} style={{ marginBottom: 8, paddingBottom: 8, borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <input className="input" style={{ flex: 1, fontSize: '0.75rem', padding: '3px 8px' }}
                  value={prop.name} placeholder="Property name"
                  onChange={e => {
                    const p = [...(schema.properties ?? [])];
                    p[i] = { ...prop, name: e.target.value };
                    onChange({ ...schema, properties: p });
                  }} />
                <button type="button" onClick={() => onChange({ ...schema, properties: schema.properties?.filter((_, j) => j !== i) })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)', fontSize: 16, lineHeight: 1, transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}>×</button>
              </div>
              <SchemaBuilder schema={prop.schema} showRequired level={level + 1}
                onChange={ps => {
                  const p = [...(schema.properties ?? [])];
                  p[i] = { ...prop, schema: ps };
                  onChange({ ...schema, properties: p });
                }} />
            </div>
          ))}
          <button type="button" className="btn btn-ghost btn-sm"
            style={{ fontSize: '0.6875rem', border: '1px dashed var(--border)', marginTop: 4 }}
            onClick={() => onChange({ ...schema, properties: [...(schema.properties ?? []), { name: '', schema: { type: 'any' as DataType } }] })}>
            + Add property
          </button>
        </div>
      )}
    </div>
  );
}
