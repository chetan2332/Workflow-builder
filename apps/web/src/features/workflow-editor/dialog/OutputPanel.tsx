import type { Handle, NodeExecutionState } from '@n8n-project/shared';
import { inferSchema } from '@n8n-project/shared';
import { SchemaBuilder } from './SchemaBuilder';

interface OutputPanelProps {
  handles: Handle[];
  executionState?: NodeExecutionState;
  dynamicHandles: boolean;
  onUpdateHandle: (handle: Handle) => void;
  onAddHandle: () => void;
  onRemoveHandle: (id: string) => void;
}

export function OutputPanel({
  handles,
  executionState,
  dynamicHandles,
  onUpdateHandle,
  onAddHandle,
  onRemoveHandle,
}: OutputPanelProps) {
  const handleInferSchema = (handle: Handle) => {
    const data = executionState?.outputData?.[handle.id];
    if (!data || data.length === 0) return;

    const inferred = inferSchema(data[0]);
    onUpdateHandle({ ...handle, schema: inferred });
  };

  return (
    <div className="w-1/4 border border-slate-700 rounded-lg p-3 overflow-y-auto">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold">OUTPUTS</h3>
        <span className="text-xs text-slate-400">{handles.length}</span>
      </div>

      {/* Execution Status */}
      {executionState && (
        <div className="mb-3 text-xs">
          {executionState.status === 'pending' && (
            <span className="text-slate-500">⚠ Not executed yet</span>
          )}
          {executionState.status === 'success' && (
            <span className="text-green-400">✓ Executed successfully</span>
          )}
          {executionState.status === 'error' && (
            <span className="text-red-400">✗ Execution error</span>
          )}
          {executionState.status === 'partial' && (
            <span className="text-amber-400">⚠ Partial execution</span>
          )}
        </div>
      )}

      {handles.length === 0 ? (
        <p className="text-xs text-slate-500">No output handles</p>
      ) : (
        <div className="space-y-3">
          {handles.map(handle => {
            const outputData = executionState?.outputData?.[handle.id];
            const hasData = outputData && outputData.length > 0;

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
                  {/* Output Data Preview (Read-only) */}
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Output Data:</div>
                    {hasData ? (
                      <pre className="text-xs bg-slate-900 p-2 rounded overflow-auto max-h-24">
                        {JSON.stringify(outputData[0], null, 2)}
                      </pre>
                    ) : (
                      <p className="text-xs text-slate-500 italic">
                        Execute node to see output.
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
                      <div className="text-xs text-slate-400 mb-1">Output Schema:</div>
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
          + Add Output Handle
        </button>
      )}
    </div>
  );
}
