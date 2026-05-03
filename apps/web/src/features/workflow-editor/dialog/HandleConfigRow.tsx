import type { HandleDefinition } from './types';

interface HandleConfigRowProps {
  handle: HandleDefinition;
  onUpdate: (updates: Partial<HandleDefinition>) => void;
  onRemove: () => void;
  canRemove?: boolean; // Can this handle be removed?
}

export function HandleConfigRow({ handle, onUpdate, onRemove, canRemove = true }: HandleConfigRowProps) {
  return (
    <div className="border border-slate-700 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-300">
          Handle {handle.id}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 text-xs"
          >
            ✕ Remove
          </button>
        )}
      </div>

      {/* Label input */}
      <div className="space-y-1">
        <label className="label-sm">Label</label>
        <input
          type="text"
          value={handle.label}
          onChange={(e) => onUpdate({ label: e.target.value })}
          className="input"
          placeholder="e.g., in-1, dataSource"
        />
      </div>

      {/* Type selector */}
      <div className="space-y-1">
        <label className="label-sm">Type</label>
        <select
          value={handle.type}
          onChange={(e) => onUpdate({ type: e.target.value as any })}
          className="input"
        >
          <option value="any">any (no validation)</option>
          <option value="json">json</option>
          <option value="flow">flow</option>
          <option value="string">string</option>
          <option value="number">number</option>
          <option value="boolean">boolean</option>
        </select>
      </div>

      {/* Side selector */}
      <div className="space-y-1">
        <label className="label-sm">Side</label>
        <select
          value={handle.side}
          onChange={(e) => onUpdate({ side: e.target.value as any })}
          className="input"
        >
          <option value="left">left</option>
          <option value="right">right</option>
          <option value="top">top</option>
          <option value="bottom">bottom</option>
        </select>
      </div>

      {/* Required checkbox */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={`required-${handle.id}`}
          checked={handle.required || false}
          onChange={(e) => onUpdate({ required: e.target.checked })}
          className="w-4 h-4"
        />
        <label htmlFor={`required-${handle.id}`} className="label-sm">
          Required
        </label>
      </div>

      {/* Helper text */}
      <p className="text-xs text-slate-500">
        {handle.type === 'any'
          ? 'No validation will be performed'
          : `Will validate as ${handle.type} type (permissive)`
        }
      </p>
    </div>
  );
}
