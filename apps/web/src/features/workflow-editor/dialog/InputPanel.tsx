import type { Handle } from '@n8n-project/shared';
import { inferSchema } from '@n8n-project/shared';
import { SchemaBuilder } from './SchemaBuilder';

interface InputPanelProps {
  handles: Handle[];
  inputData: Record<string, any[]>;
  dynamicHandles: boolean;
  onUpdateHandle: (handle: Handle) => void;
  onAddHandle: () => void;
  onRemoveHandle: (id: string) => void;
}

export function InputPanel({
  handles,
  inputData,
  dynamicHandles,
  onUpdateHandle,
  onAddHandle,
  onRemoveHandle,
}: InputPanelProps) {
  const handleInferSchema = (handle: Handle) => {
    const data = inputData[handle.id];
    if (!data || data.length === 0) return;

    const inferred = inferSchema(data[0]);
    onUpdateHandle({ ...handle, schema: inferred });
  };

  return (
    <div className="w-1/4 border border-slate-700 rounded-lg p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">INPUTS</h3>
        <span className="text-xs text-slate-400">{handles.length}</span>
      </div>

      {handles.length === 0 ? (
        <p className="text-xs text-slate-500">No input handles</p>
      ) : (
        <div className="space-y-3">
          {handles.map(handle => {
            const data = inputData[handle.id];
            const hasData = data && data.length > 0;

            return (
              <div
                key={handle.id}
                className="border border-slate-700 rounded-lg overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-2 bg-slate-800/50">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{handle.label}</span>
                    <span className="px-1.5 py-0.5 text-xs rounded bg-slate-700 text-slate-300">
                      {handle.schema?.type || 'any'}
                    </span>
                  </div>
                  {!handle.fixed && dynamicHandles && (
                    <button
                      type="button"
                      onClick={() => onRemoveHandle(handle.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Content */}
                <div className="p-2 space-y-2">
                  {/* Input Data Preview */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Input Data:</div>
                    {hasData ? (
                      <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto max-h-24">
                        {JSON.stringify(data[0], null, 2)}
                      </pre>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        No data. Execute previous nodes.
                      </p>
                    )}
                  </div>

                  {/* Infer Schema Button */}
                  {handle.schemaEditable && hasData && (
                    <button
                      type="button"
                      onClick={() => handleInferSchema(handle)}
                      className="btn-ghost text-xs px-2 py-1"
                    >
                      ✨ Infer Schema
                    </button>
                  )}

                  {/* Schema Editor */}
                  {handle.schemaEditable ? (
                    <div>
                      <div className="text-xs text-slate-400 mb-1">Expected Schema:</div>
                      <SchemaBuilder
                        schema={handle.schema}
                        onChange={(schema) => onUpdateHandle({ ...handle, schema })}
                      />
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500">Schema is fixed</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Handle Button */}
      {dynamicHandles && (
        <button
          type="button"
          onClick={onAddHandle}
          className="btn-ghost w-full mt-3 px-3 py-2 text-xs border border-dashed border-slate-700"
        >
          + Add Input Handle
        </button>
      )}
    </div>
  );
}
