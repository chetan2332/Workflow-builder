import type { HandleDefinition, ExecutionState } from './types';
import { OutputHandleItem } from './OutputHandleItem';

interface RightPanelProps {
  handles: HandleDefinition[];
  execution: ExecutionState;
  expandedHandles: Set<string>;
  onToggleExpand: (handleId: string) => void;
}

export function RightPanel({
  handles,
  execution,
  expandedHandles,
  onToggleExpand,
}: RightPanelProps) {
  return (
    <div className="w-1/4 border border-slate-700 rounded-lg p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">OUTPUTS</h3>
        <span className="text-xs text-slate-400">{handles.length}</span>
      </div>

      {/* Execution status */}
      {execution.status === 'idle' && (
        <div className="text-xs text-slate-500 mb-4">
          ⚠ Not executed yet. Click Execute to run.
        </div>
      )}

      {execution.status === 'running' && (
        <div className="text-xs text-sky-400 mb-4">
          ⏳ Executing...
        </div>
      )}

      {execution.status === 'success' && (
        <div className="text-xs text-green-400 mb-4">
          ✓ Success in {execution.duration}ms
        </div>
      )}

      {execution.status === 'error' && (
        <div className="text-xs text-red-400 mb-4">
          ✗ Error: {execution.error}
        </div>
      )}

      {/* Output handles */}
      {handles.length === 0 ? (
        <p className="text-xs text-slate-500">No outputs</p>
      ) : (
        handles.map(handle => (
          <OutputHandleItem
            key={handle.id}
            handle={handle}
            expanded={expandedHandles.has(handle.id)}
            onToggleExpand={() => onToggleExpand(handle.id)}
            executed={execution.status === 'success'}
          />
        ))
      )}
    </div>
  );
}
