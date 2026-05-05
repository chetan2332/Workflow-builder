import { Handle, Position } from '@xyflow/react';

export function DummyNode() {

  return (
    <div
      className="
        w-6 h-6
        rounded-md
        bg-slate-800/50
        border border-dashed border-slate-500/50
        flex items-center justify-center
        cursor-pointer
        transition-all duration-150
        hover:bg-slate-800/70
        hover:border-sky-500/60
        hover:scale-105
        hover:shadow-[0_0_8px_rgba(56,189,248,0.4)]
        relative z-10
      "
    >
      {/* Plus icon - reduced brightness, ensured centering */}
      <div className="text-sm font-semibold text-slate-400 leading-none select-none">
        +
      </div>

      {/* Hidden handle - invisible but functional for edge connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        isConnectable={true}
        className="!opacity-0 !pointer-events-none"
        style={{
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
        }}
      />
    </div>
  );
}
