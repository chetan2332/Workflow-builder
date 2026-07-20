import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, Zap, Code2, GitBranch, Box } from 'lucide-react';
import { useNodeDefinitions } from '../../hooks/useNodeDefinitions';
import { NodeCategory } from '@n8n-project/shared';
import type { NodeDefinition } from '@n8n-project/shared';

export const DRAG_TYPE = 'application/reactflow';

const CATEGORY_META: Record<string, { color: string; dim: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }> = {
  [NodeCategory.TRIGGER]: { color: 'var(--cat-trigger)', dim: 'var(--cat-trigger-dim)', Icon: Zap },
  [NodeCategory.CODE]:    { color: 'var(--cat-code)',    dim: 'var(--cat-code-dim)',    Icon: Code2 },
  [NodeCategory.FLOW]:    { color: 'var(--cat-flow)',    dim: 'var(--cat-flow-dim)',    Icon: GitBranch },
  [NodeCategory.OTHER]:   { color: 'var(--cat-other)',   dim: 'var(--cat-other-dim)',   Icon: Box },
};

function getCategoryMeta(category: string) {
  return CATEGORY_META[category] ?? CATEGORY_META[NodeCategory.OTHER];
}

type NodeLibraryDrawerProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function NodeLibraryDrawer({ isOpen, onToggle }: NodeLibraryDrawerProps) {
  const { groupedDefinitions, isLoading } = useNodeDefinitions();
  const [query, setQuery] = useState('');

  const filtered = query.trim()
    ? Object.entries(groupedDefinitions).reduce<Record<string, NodeDefinition[]>>((acc, [cat, nodes]) => {
        const matches = nodes.filter(n =>
          n.label.toLowerCase().includes(query.toLowerCase()) ||
          n.description.toLowerCase().includes(query.toLowerCase())
        );
        if (matches.length) acc[cat] = matches;
        return acc;
      }, {})
    : groupedDefinitions;

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: '50%',
          right: isOpen ? -12 : -12,
          transform: 'translateY(-50%)',
          zIndex: 20,
          width: 24,
          height: 48,
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: '0 6px 6px 0',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-2)',
          transition: 'color 150ms, background 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-1)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}
        title={isOpen ? 'Close node library' : 'Open node library'}
      >
        {isOpen ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>

      {isOpen && (
        <aside
          style={{
            width: 256,
            height: '100%',
            backgroundColor: 'var(--surface)',
            borderRight: '1px solid var(--border)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          className="animate-slide-left"
        >
          {/* Header */}
          <div style={{ padding: '0.875rem 0.875rem 0.625rem', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
            <p className="t-label" style={{ marginBottom: 8 }}>Node library</p>
            <div style={{ position: 'relative' }}>
              <Search size={12} style={{
                position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)',
                color: 'var(--text-3)', pointerEvents: 'none',
              }} />
              <input
                className="input"
                style={{ paddingLeft: 28, fontSize: '0.75rem' }}
                placeholder="Search nodes…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Node list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0.625rem 0.625rem' }}>
            {isLoading ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', padding: '0.5rem 0.25rem' }}>Loading…</p>
            ) : Object.keys(filtered).length === 0 ? (
              <p style={{ fontSize: '0.75rem', color: 'var(--text-3)', padding: '0.5rem 0.25rem' }}>No nodes match "{query}"</p>
            ) : (
              Object.entries(filtered).map(([category, nodes]) => {
                const meta = getCategoryMeta(category);
                return (
                  <div key={category} style={{ marginBottom: '1rem' }}>
                    <div className="t-label" style={{ padding: '0 0.375rem', marginBottom: '0.375rem' }}>
                      {category}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {nodes.map(def => (
                        <NodeCard key={def.type} def={def} meta={meta} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      )}
    </div>
  );
}

function NodeCard({
  def,
  meta,
}: {
  def: NodeDefinition;
  meta: { color: string; dim: string; Icon: React.ComponentType<{ size?: number; strokeWidth?: number }> };
}) {
  return (
    <div
      draggable
      onDragStart={e => {
        e.dataTransfer.setData(DRAG_TYPE, def.type);
        e.dataTransfer.effectAllowed = 'move';
      }}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '0.5rem 0.5rem',
        borderRadius: 8, cursor: 'grab',
        border: '1px solid transparent',
        transition: 'background 150ms, border-color 150ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--surface-2)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
      }}
    >
      {/* Icon */}
      <div
        data-node-icon="true"
        style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          backgroundColor: meta.dim,
          border: `1px solid ${meta.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <meta.Icon size={13} strokeWidth={2} />
      </div>

      {/* Text */}
      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--text-1)', lineHeight: 1.2 }}>{def.label}</p>
        <p style={{
          fontSize: '0.6875rem', color: 'var(--text-3)', lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          marginTop: 2,
        }}>{def.description}</p>
      </div>
    </div>
  );
}
