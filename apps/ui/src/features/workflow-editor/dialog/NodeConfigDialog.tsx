import { useState, useMemo, useEffect } from 'react';
import type { Handle, NodeDefinition, NodeExecutionState, WorkflowNode } from '@n8n-project/shared';
import { X, Play, Save, ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { getFieldComponent } from '../fields/fieldComponentMap';
import { SchemaBuilder } from './SchemaBuilder';
import { inferSchema } from '@n8n-project/shared';
import { NodeCategory } from '@n8n-project/shared';

const CATEGORY_COLOR: Record<string, string> = {
  [NodeCategory.TRIGGER]: 'var(--cat-trigger)',
  [NodeCategory.CODE]:    'var(--cat-code)',
  [NodeCategory.FLOW]:    'var(--cat-flow)',
  [NodeCategory.OTHER]:   'var(--cat-other)',
};

interface Props {
  nodeData: WorkflowNode;
  definition: NodeDefinition;
  executionState?: NodeExecutionState;
  isOpen: boolean;
  onClose: () => void;
  onSave: (configValues: Record<string, unknown>, outputHandles: Handle[], inputHandles: Handle[]) => void;
  onExecute?: (configValues: Record<string, unknown>, inputData: Record<string, unknown[]>) => void;
}

export function NodeConfigDialog({ nodeData, definition, executionState, isOpen, onClose, onSave, onExecute }: Props) {
  const [inputHandles,  setInputHandles]  = useState<Handle[]>(() => [...nodeData.inputHandles]);
  const [outputHandles, setOutputHandles] = useState<Handle[]>(() => [...nodeData.outputHandles]);
  const [configValues,  setConfigValues]  = useState<Record<string, unknown>>(() => {
    const existing = nodeData.configValues ?? {};
    return Object.fromEntries((definition.config?.fields ?? []).map(f => [f.id, existing[f.id]]));
  });

  const [activeTab, setActiveTab] = useState(() => definition.config?.tabs?.[0] ?? 'config');
  const [showInputs,  setShowInputs]  = useState(false);
  const [showOutputs, setShowOutputs] = useState(false);

  const inputData = useMemo<Record<string, unknown[]>>(() => {
    const mock: Record<string, unknown[]> = {};
    inputHandles.forEach(h => {
      if (h.schema?.type === 'object')  mock[h.id] = [{ id: 1, name: 'Sample', value: 42 }];
      else if (h.schema?.type === 'string')  mock[h.id] = ['Hello World'];
      else if (h.schema?.type === 'number')  mock[h.id] = [123];
      else if (h.schema?.type === 'boolean') mock[h.id] = [true];
      else mock[h.id] = [{ example: 'data' }];
    });
    return mock;
  }, [inputHandles]);

  const casesField = definition.config?.fields?.find(f => f.type === 'cases');
  useEffect(() => {
    if (!casesField) return;
    const items = (configValues[casesField.id] ?? []) as Array<{ label: string; condition: string }>;
    const caseHandles: Handle[] = items.map((item, i) => ({
      id: `case-${i}`, label: item.label || `Case ${i + 1}`, type: 'output' as const,
      schema: { type: 'any' }, fixed: false, schemaEditable: true,
    }));
    const fixedHandles = definition.outputHandles.filter(h => h.fixed);
    setOutputHandles([...caseHandles, ...fixedHandles]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configValues[casesField?.id ?? '']]);

  if (!isOpen) return null;

  const tabs = definition.config?.tabs;
  const fields = definition.config?.fields ?? [];
  const visibleFields = tabs ? fields.filter(f => (f.tab ?? 'config') === activeTab) : fields;
  const color = CATEGORY_COLOR[nodeData.category] ?? CATEGORY_COLOR[NodeCategory.OTHER];

  const execStatus = executionState?.status;

  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        className="animate-in"
        style={{
          width: '88vw', maxWidth: 1100,
          height: '86vh',
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.7)',
        }}
      >
        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 1.25rem',
          height: 52,
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          backgroundColor: 'var(--surface-2)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: color, flexShrink: 0,
            }} />
            <div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-1)' }}>
                {nodeData.label}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', color: 'var(--text-3)', marginLeft: 10 }}>
                {nodeData.type}
              </span>
            </div>

            {execStatus && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                {execStatus === 'success' && <><CheckCircle2 size={13} style={{ color: 'var(--success)' }} /><span style={{ fontSize: '0.6875rem', color: 'var(--success)', fontFamily: 'var(--font-mono)' }}>success</span></>}
                {execStatus === 'error'   && <><XCircle     size={13} style={{ color: 'var(--danger)' }}  /><span style={{ fontSize: '0.6875rem', color: 'var(--danger)',  fontFamily: 'var(--font-mono)' }}>error</span></>}
                {execStatus === 'partial' && <><AlertCircle size={13} style={{ color: 'var(--warning)' }} /><span style={{ fontSize: '0.6875rem', color: 'var(--warning)', fontFamily: 'var(--font-mono)' }}>partial</span></>}
              </div>
            )}
          </div>

          <button className="btn-icon" onClick={onClose}><X size={16} /></button>
        </div>

        {/* ── Body: left config + right handles ── */}
        <div style={{ flex: 1, display: 'flex', minHeight: 0 }}>

          {/* Config panel */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            {/* Tabs */}
            {tabs && tabs.length > 1 && (
              <div className="tab-bar" style={{ paddingLeft: '1.25rem', flexShrink: 0 }}>
                {tabs.map(tab => (
                  <button key={tab} className={`tab${activeTab === tab ? ' active' : ''}`} onClick={() => setActiveTab(tab)}>
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            )}

            {/* Fields */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {visibleFields.length === 0 ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-3)' }}>No configuration for this node.</p>
                </div>
              ) : visibleFields.map(field => {
                const FieldComponent = getFieldComponent(field.type);
                if (!FieldComponent) return <p key={field.id} style={{ fontSize: '0.75rem', color: 'var(--warning)' }}>Unknown field type: {field.type}</p>;
                return (
                  <FieldComponent
                    key={field.id}
                    field={field}
                    value={configValues[field.id]}
                    onChange={(id, val) => setConfigValues(prev => ({ ...prev, [id]: val }))}
                  />
                );
              })}
            </div>
          </div>

          {/* Handles panel */}
          {(inputHandles.length > 0 || outputHandles.length > 0) && (
            <div style={{
              width: 280, borderLeft: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', overflowY: 'auto',
              flexShrink: 0,
            }}>
              {/* Inputs */}
              {inputHandles.length > 0 && (
                <HandleSection
                  title="Inputs"
                  count={inputHandles.length}
                  isOpen={showInputs}
                  onToggle={() => setShowInputs(v => !v)}
                  accentColor="var(--cat-code)"
                >
                  {inputHandles.map(h => (
                    <HandleRow
                      key={h.id}
                      handle={h}
                      data={inputData[h.id]}
                      onUpdate={updated => setInputHandles(prev => prev.map(hh => hh.id === updated.id ? updated : hh))}
                      side="input"
                    />
                  ))}
                </HandleSection>
              )}

              {/* Outputs */}
              {outputHandles.length > 0 && (
                <HandleSection
                  title="Outputs"
                  count={outputHandles.length}
                  isOpen={showOutputs}
                  onToggle={() => setShowOutputs(v => !v)}
                  accentColor="var(--accent)"
                >
                  {outputHandles.map(h => (
                    <HandleRow
                      key={h.id}
                      handle={h}
                      data={executionState?.outputData?.[h.id]}
                      onUpdate={updated => setOutputHandles(prev => prev.map(hh => hh.id === updated.id ? updated : hh))}
                      side="output"
                    />
                  ))}
                </HandleSection>
              )}
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          gap: 8, padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          backgroundColor: 'var(--surface-2)',
        }}>
          {onExecute && (
            <button
              type="button"
              className="btn btn-secondary btn-md"
              onClick={() => onExecute(configValues, inputData)}
            >
              <Play size={12} fill="currentColor" />
              Run node
            </button>
          )}
          <button
            type="button"
            className="btn btn-primary btn-md"
            onClick={() => { onSave(configValues, outputHandles, inputHandles); onClose(); }}
          >
            <Save size={13} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── HandleSection ── */

function HandleSection({
  title, count, isOpen, onToggle, accentColor, children,
}: {
  title: string; count: number; isOpen: boolean; onToggle: () => void;
  accentColor: string; children: React.ReactNode;
}) {
  return (
    <div style={{ borderBottom: '1px solid var(--border)' }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          width: '100%', padding: '0.75rem 1rem',
          background: 'none', border: 'none', cursor: 'pointer',
          transition: 'background 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--surface-2)')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 3, height: 14, borderRadius: 2, backgroundColor: accentColor, flexShrink: 0 }} />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.625rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-2)', fontWeight: 500 }}>{title}</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', backgroundColor: 'var(--surface-3)', padding: '1px 5px', borderRadius: 4 }}>{count}</span>
        </div>
        {isOpen ? <ChevronDown size={13} style={{ color: 'var(--text-3)' }} /> : <ChevronRight size={13} style={{ color: 'var(--text-3)' }} />}
      </button>

      {isOpen && (
        <div style={{ padding: '0 0.875rem 0.875rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {children}
        </div>
      )}
    </div>
  );
}

/* ── HandleRow ── */

function HandleRow({
  handle, data, onUpdate, side,
}: {
  handle: Handle; data?: unknown[]; onUpdate: (h: Handle) => void; side: 'input' | 'output';
}) {
  const [schemaOpen, setSchemaOpen] = useState(false);
  const hasData = data && data.length > 0;
  const accentColor = side === 'input' ? 'var(--cat-code)' : 'var(--accent)';

  return (
    <div style={{
      borderRadius: 8, border: '1px solid var(--border)',
      overflow: 'hidden', backgroundColor: 'var(--bg)',
    }}>
      {/* Handle header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.625rem', backgroundColor: 'var(--surface-2)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: accentColor, flexShrink: 0 }} />
        <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-1)', flex: 1 }}>{handle.label}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)',
          backgroundColor: 'var(--surface-3)', padding: '1px 5px', borderRadius: 3,
        }}>{handle.schema?.type ?? 'any'}</span>
      </div>

      {/* Data preview */}
      <div style={{ padding: '0.5rem 0.625rem' }}>
        {hasData ? (
          <pre style={{
            margin: 0, fontSize: '0.625rem', fontFamily: 'var(--font-mono)',
            color: 'var(--text-2)', maxHeight: 80, overflow: 'auto',
            whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          }}>{JSON.stringify(data![0], null, 2)}</pre>
        ) : (
          <p style={{ fontSize: '0.6875rem', color: 'var(--text-3)', fontStyle: 'italic' }}>
            {side === 'output' ? 'Run node to see output.' : 'No data yet.'}
          </p>
        )}

        {handle.schemaEditable && (
          <div style={{ marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <button
              type="button"
              onClick={() => setSchemaOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'none', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: 'var(--text-3)', padding: 0, transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              {schemaOpen ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              Schema
            </button>

            {schemaOpen && (
              <div>
                {hasData && (
                  <button type="button" className="btn btn-ghost btn-sm"
                    style={{ fontSize: '0.6rem', padding: '2px 6px', marginBottom: 6 }}
                    onClick={() => { const inferred = inferSchema(data![0]); onUpdate({ ...handle, schema: inferred }); }}>
                    Infer from data
                  </button>
                )}
                <SchemaBuilder schema={handle.schema} onChange={schema => onUpdate({ ...handle, schema })} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
