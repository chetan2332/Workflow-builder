import { Handle, Position } from '@xyflow/react';

export function DummyNode() {
  return (
    <div style={{
      width: 24, height: 24, borderRadius: 6,
      backgroundColor: 'var(--surface-2)',
      border: '1px dashed var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', transition: 'all 150ms',
      position: 'relative', zIndex: 10,
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--glow-accent)';
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
      (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
    }}
    >
      <span style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1, userSelect: 'none' }}>+</span>
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={true}
        style={{ opacity: 0, pointerEvents: 'none', left: 0, top: '50%', transform: 'translateY(-50%)' }}
      />
    </div>
  );
}
