import type { HandleDefinition } from './types';
import { InputHandleItem } from './InputHandleItem';

interface LeftPanelProps {
  handles: HandleDefinition[];
  onUpdateTestData: (handleId: string, data: any) => void;
  expandedHandles: Set<string>;
  onToggleExpand: (handleId: string) => void;
}

export function LeftPanel({
  handles,
  onUpdateTestData,
  expandedHandles,
  onToggleExpand,
}: LeftPanelProps) {
  return (
    <div className="w-1/4 border border-slate-700 rounded-lg p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">INPUTS</h3>
        <span className="text-xs text-slate-400">{handles.length}</span>
      </div>

      {handles.length === 0 ? (
        <p className="text-xs text-slate-500">No inputs</p>
      ) : (
        handles.map(handle => (
          <InputHandleItem
            key={handle.id}
            handle={handle}
            expanded={expandedHandles.has(handle.id)}
            onToggleExpand={() => onToggleExpand(handle.id)}
            onUpdateData={(data) => onUpdateTestData(handle.id, data)}
          />
        ))
      )}
    </div>
  );
}
