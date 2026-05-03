import type { HandleDefinition } from './types';
import { validateHandleInput } from '../handleValidation';
import { CodeMirrorEditor } from '../fields/CodeMirrorEditor';

interface InputHandleItemProps {
  handle: HandleDefinition;
  expanded: boolean;
  onToggleExpand: () => void;
  onUpdateData: (data: any) => void;
}

export function InputHandleItem({
  handle,
  expanded,
  onToggleExpand,
  onUpdateData,
}: InputHandleItemProps) {
  const validation = validateHandleInput(
    handle.testData,
    handle.type,
    handle.required
  );

  return (
    <div className="mb-3 border border-slate-700 rounded-lg overflow-hidden">
      {/* Header - Always visible */}
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
          {handle.required && (
            <span className="text-red-500 text-xs">*</span>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex items-center gap-1">
          {!validation.valid && (
            <span className="text-red-400 text-xs">⚠</span>
          )}
          {handle.connected ? (
            <span className="text-green-400 text-xs">✓</span>
          ) : (
            <span className="text-slate-500 text-xs">✗</span>
          )}
        </div>
      </button>

      {/* Expandable content */}
      {expanded && (
        <div className="p-2 space-y-2">
          <div className="text-xs text-slate-400 mb-1">
            Test data (editable):
          </div>

          {/* Editable input based on type */}
          {handle.type === 'json' || handle.type === 'any' ? (
            <CodeMirrorEditor
              value={typeof handle.testData === 'string'
                ? handle.testData
                : JSON.stringify(handle.testData || {}, null, 2)
              }
              language="json"
              onChange={onUpdateData}
              height="120px"
              placeholder={`{ "example": "data" }`}
            />
          ) : (
            <textarea
              value={String(handle.testData ?? '')}
              onChange={(e) => onUpdateData(e.target.value)}
              className="input h-20 resize-none text-xs"
              placeholder={`Enter ${handle.type} value`}
            />
          )}

          {/* Validation error */}
          {!validation.valid && (
            <p className="text-xs text-red-400">{validation.error}</p>
          )}

          {/* Helper text */}
          <p className="text-xs text-slate-500">
            Type: {handle.type} {handle.type === 'any' && '(no validation)'}
          </p>
        </div>
      )}
    </div>
  );
}
