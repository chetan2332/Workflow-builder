import type { HandleDefinition } from './types';
import type { NodeTemplateConfig } from '../../../nodeConfigSchema';
import { HandleConfigRow } from './HandleConfigRow';

interface HandlesTabProps {
  template: NodeTemplateConfig;
  handles: {
    inputs: HandleDefinition[];
    outputs: HandleDefinition[];
  };
  onUpdateHandles: (handles: { inputs: HandleDefinition[]; outputs: HandleDefinition[] }) => void;
}

export function HandlesTab({ template, handles, onUpdateHandles }: HandlesTabProps) {
  const dynamicHandles = template.dynamicHandles || { inputs: false, outputs: false };

  const addInputHandle = () => {
    const newHandle: HandleDefinition = {
      id: `in-${handles.inputs.length + 1}`,
      kind: 'input',
      type: 'any', // Default type
      label: `in-${handles.inputs.length + 1}`,
      side: 'left',
      required: false,
      testData: {},
      connected: false,
    };

    onUpdateHandles({
      ...handles,
      inputs: [...handles.inputs, newHandle],
    });
  };

  const removeInputHandle = (id: string) => {
    onUpdateHandles({
      ...handles,
      inputs: handles.inputs.filter(h => h.id !== id),
    });
  };

  const updateInputHandle = (id: string, updates: Partial<HandleDefinition>) => {
    onUpdateHandles({
      ...handles,
      inputs: handles.inputs.map(h =>
        h.id === id ? { ...h, ...updates } : h
      ),
    });
  };

  const addOutputHandle = () => {
    const newHandle: HandleDefinition = {
      id: `out-${handles.outputs.length + 1}`,
      kind: 'output',
      type: 'json', // Default type for outputs
      label: `out-${handles.outputs.length + 1}`,
      side: 'right',
      fired: false,
    };

    onUpdateHandles({
      ...handles,
      outputs: [...handles.outputs, newHandle],
    });
  };

  const removeOutputHandle = (id: string) => {
    onUpdateHandles({
      ...handles,
      outputs: handles.outputs.filter(h => h.id !== id),
    });
  };

  const updateOutputHandle = (id: string, updates: Partial<HandleDefinition>) => {
    onUpdateHandles({
      ...handles,
      outputs: handles.outputs.map(h =>
        h.id === id ? { ...h, ...updates } : h
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Handles Section */}
      <div>
        <h3 className="text-sm font-semibold mb-3">INPUT HANDLES</h3>
        <div className="border border-slate-700 rounded-lg p-3 space-y-3">
          {handles.inputs.length === 0 ? (
            <p className="text-xs text-slate-500">No input handles</p>
          ) : (
            handles.inputs.map(handle => (
              <HandleConfigRow
                key={handle.id}
                handle={handle}
                onUpdate={(updates) => updateInputHandle(handle.id, updates)}
                onRemove={() => removeInputHandle(handle.id)}
                canRemove={dynamicHandles.inputs}
              />
            ))
          )}

          {dynamicHandles.inputs && (
            <button
              type="button"
              onClick={addInputHandle}
              className="btn-ghost w-full px-3 py-2 text-xs border border-dashed border-slate-700"
            >
              + Add Input Handle
            </button>
          )}

          {!dynamicHandles.inputs && handles.inputs.length === 0 && (
            <p className="text-xs text-slate-400">Input handles are fixed for this node</p>
          )}
        </div>
      </div>

      {/* Output Handles Section */}
      <div>
        <h3 className="text-sm font-semibold mb-3">OUTPUT HANDLES</h3>
        <div className="border border-slate-700 rounded-lg p-3 space-y-3">
          {handles.outputs.length === 0 ? (
            <p className="text-xs text-slate-500">No output handles</p>
          ) : (
            handles.outputs.map(handle => (
              <HandleConfigRow
                key={handle.id}
                handle={handle}
                onUpdate={(updates) => updateOutputHandle(handle.id, updates)}
                onRemove={() => removeOutputHandle(handle.id)}
                canRemove={dynamicHandles.outputs}
              />
            ))
          )}

          {dynamicHandles.outputs && (
            <button
              type="button"
              onClick={addOutputHandle}
              className="btn-ghost w-full px-3 py-2 text-xs border border-dashed border-slate-700"
            >
              + Add Output Handle
            </button>
          )}

          {!dynamicHandles.outputs && handles.outputs.length === 0 && (
            <p className="text-xs text-slate-400">Output handles are fixed for this node</p>
          )}
        </div>
      </div>
    </div>
  );
}
