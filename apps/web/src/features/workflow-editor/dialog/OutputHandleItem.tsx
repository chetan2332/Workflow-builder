import type { HandleDefinition } from './types';
import { CodeMirrorEditor } from '../fields/CodeMirrorEditor';

interface OutputHandleItemProps {
  handle: HandleDefinition;
  expanded: boolean;
  onToggleExpand: () => void;
  executed: boolean;
}

export function OutputHandleItem({
  handle,
  expanded,
  onToggleExpand,
  executed,
}: OutputHandleItemProps) {
  const hasData = handle.outputData !== undefined && handle.outputData !== null;

  return (
    <div className="mb-3 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={onToggleExpand}
        className="w-full flex items-center justify-between p-2 bg-slate-800/50 hover:bg-slate-800 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs">{expanded ? '▼' : '▶'}</span>
          <span className="text-sm font-medium">{handle.label}</span>
          <span className="px-1.5 py-0.5 text-xs rounded bg-slate-700 text-slate-300">
            {handle.type}
          </span>
        </div>

        {/* Fired indicator */}
        {executed && (
          handle.fired ? (
            <span className="text-green-400 text-xs">✓ Fired</span>
          ) : (
            <span className="text-slate-500 text-xs">✗ Not fired</span>
          )
        )}
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="p-2 space-y-2">
          {!executed && (
            <p className="text-xs text-slate-500">
              Execute node to see output
            </p>
          )}

          {executed && !hasData && (
            <p className="text-xs text-slate-500">
              {handle.type === 'flow'
                ? 'Flow signal (no data)'
                : 'No data returned'
              }
            </p>
          )}

          {executed && hasData && (
            <>
              <div className="text-xs text-slate-400 mb-1">Result:</div>
              <CodeMirrorEditor
                value={JSON.stringify(handle.outputData, null, 2)}
                language="json"
                onChange={() => {}} // Read-only
                height="120px"
                readOnly={true}
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    JSON.stringify(handle.outputData, null, 2)
                  );
                }}
                className="btn-ghost px-2 py-1 text-xs w-full"
              >
                Copy Result
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
