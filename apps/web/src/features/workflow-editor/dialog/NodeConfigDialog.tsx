import { useState, useMemo } from 'react';
import type { Handle, NodeDefinition, NodeExecutionState, WorkflowNode } from '@n8n-project/shared';
import { InputPanel } from './InputPanel';
import { ConfigPanel } from './ConfigPanel';
import { OutputPanel } from './OutputPanel';

interface NodeConfigDialogProps {
  nodeData: WorkflowNode;
  definition: NodeDefinition;
  executionState?: NodeExecutionState;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updates: Partial<WorkflowNode>) => void;
  onExecute?: (configValues: Record<string, any>, inputData: Record<string, any[]>) => void;
}

export function NodeConfigDialog({
  nodeData,
  definition,
  executionState,
  isOpen,
  onClose,
  onSave,
  onExecute,
}: NodeConfigDialogProps) {
  // Editable copies of handles
  const [inputHandles, setInputHandles] = useState<Handle[]>(
    () => [...nodeData.inputHandles]
  );
  const [outputHandles, setOutputHandles] = useState<Handle[]>(
    () => [...nodeData.outputHandles]
  );

  // Config field values
  const [configValues, setConfigValues] = useState<Record<string, any>>(() => {
    // Initialize from nodeData.configValues or defaults from config.fields
    const initial: Record<string, any> = {};
    const existingValues = (nodeData as any).configValues ?? {};
    const fields = nodeData.config?.fields ?? [];

    for (const field of fields) {
      initial[field.id] = existingValues[field.id] ?? field.default ?? null;
    }
    return initial;
  });

  // Mock input data (will be replaced with actual data from parent nodes)
  const inputData = useMemo<Record<string, any[]>>(() => {
    const mock: Record<string, any[]> = {};
    inputHandles.forEach(handle => {
      // Generate mock data based on schema type
      if (handle.schema?.type === 'object') {
        mock[handle.id] = [{ id: 1, name: 'Sample Item', value: 42 }];
      } else if (handle.schema?.type === 'array') {
        mock[handle.id] = [[1, 2, 3]];
      } else if (handle.schema?.type === 'string') {
        mock[handle.id] = ['Hello World'];
      } else if (handle.schema?.type === 'number') {
        mock[handle.id] = [123];
      } else if (handle.schema?.type === 'boolean') {
        mock[handle.id] = [true];
      } else {
        mock[handle.id] = [{ example: 'data', count: 5 }];
      }
    });
    return mock;
  }, [inputHandles]);

  const dynamicInputs = definition.dynamicHandles?.inputs ?? false;
  const dynamicOutputs = definition.dynamicHandles?.outputs ?? false;

  if (!isOpen) return null;

  // Handle updates
  const handleUpdateInputHandle = (updated: Handle) => {
    setInputHandles(prev =>
      prev.map(h => (h.id === updated.id ? updated : h))
    );
  };

  const handleUpdateOutputHandle = (updated: Handle) => {
    setOutputHandles(prev =>
      prev.map(h => (h.id === updated.id ? updated : h))
    );
  };

  const handleAddInputHandle = () => {
    const newHandle: Handle = {
      id: `in-${inputHandles.length + 1}`,
      label: `Input ${inputHandles.length + 1}`,
      type: 'input',
      schema: { type: 'any' },
      fixed: false,
      schemaEditable: true,
    };
    setInputHandles(prev => [...prev, newHandle]);
  };

  const handleAddOutputHandle = () => {
    const newHandle: Handle = {
      id: `out-${outputHandles.length + 1}`,
      label: `Output ${outputHandles.length + 1}`,
      type: 'output',
      schema: { type: 'any' },
      fixed: false,
      schemaEditable: true,
    };
    setOutputHandles(prev => [...prev, newHandle]);
  };

  const handleRemoveInputHandle = (id: string) => {
    setInputHandles(prev => prev.filter(h => h.id !== id));
  };

  const handleRemoveOutputHandle = (id: string) => {
    setOutputHandles(prev => prev.filter(h => h.id !== id));
  };

  const handleSave = () => {
    onSave({
      inputHandles,
      outputHandles,
      configValues,
    } as any);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="app-card w-[90vw] max-w-[1400px] h-[90vh] p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold">{nodeData.label}</h2>
            <p className="text-xs text-slate-400">{nodeData.description}</p>
          </div>

          <div className="flex items-center gap-2">
            {onExecute && (
              <button
                type="button"
                onClick={() => onExecute(configValues, inputData)}
                className="btn-primary px-4 py-1.5 text-xs"
              >
                ▶ Execute Node
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* 3-Panel Layout */}
        <div className="flex-1 min-h-0 flex gap-3">
          {/* only show inputPanel if inputHandles.length > 0 */}
          {inputHandles.length > 0 && (
            <InputPanel
              handles={inputHandles}
              inputData={inputData}
              dynamicHandles={dynamicInputs}
              onUpdateHandle={handleUpdateInputHandle}
              onAddHandle={handleAddInputHandle}
              onRemoveHandle={handleRemoveInputHandle}
            />
          )}

          <ConfigPanel
            nodeData={nodeData}
            configValues={configValues}
            onConfigChange={(id, value) => setConfigValues(prev => ({ ...prev, [id]: value }))}
          />
          {/* only show outputPanel if outputHandles.length > 0 */}
          {outputHandles.length > 0 && (
            <OutputPanel
              handles={outputHandles}
              executionState={executionState}
              dynamicHandles={dynamicOutputs}
              onUpdateHandle={handleUpdateOutputHandle}
              onAddHandle={handleAddOutputHandle}
              onRemoveHandle={handleRemoveOutputHandle}
            />
          )}

        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            className="btn px-3 py-1 text-xs border border-slate-700"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="btn-primary px-4 py-1.5 text-xs"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
