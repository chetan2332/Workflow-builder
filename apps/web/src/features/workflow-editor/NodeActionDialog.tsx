import { useState, useMemo } from 'react';
import type { Node } from '@xyflow/react';
import type { NodeTemplateConfig, ActionField } from '../../nodeConfigSchema';
import type { HandleDefinition, ExecutionState, FieldValues, ValidationErrors } from './dialog/types';
import type { InputValue, TypeSchema } from '@n8n-project/shared';
import { inferSchema } from '@n8n-project/shared';
import { ThreePanelLayout } from './dialog/ThreePanelLayout';
import { LeftPanel } from './dialog/LeftPanel';
import { MiddlePanel } from './dialog/MiddlePanel';
import { RightPanel } from './dialog/RightPanel';
import { HandlesTab } from './dialog/HandlesTab';
import { SchemaBuilder } from '../../components/SchemaBuilder';
import { executeNode as executeNodeBackend } from '../../api/node-execution';
import { validateAllInputs } from './handleValidation';
import {
  BooleanField,
  CodeField,
  CredentialRefField,
  EnumField,
  FileRefField,
  HandleCountField,
  HandleLabelsField,
  HandleTypesField,
  HttpMethodField,
  InlineTextField,
  JsonField,
  KeyValueField,
  ModelRefField,
  SecretRefField,
  TextField,
  TriggerInvokeInfoField,
  UrlField,
} from './fields';

type NodeActionDialogProps = {
  template: NodeTemplateConfig;
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nextState: Record<string, unknown>) => void;
};

function getInitialValue(field: ActionField, current: unknown) {
  if (current !== undefined && current !== null) {
    return current;
  }
  if (field.defaultValue !== undefined) {
    return field.defaultValue;
  }
  // Return appropriate default based on field type
  if (field.type === 'boolean') return false;
  if (field.type === 'number' || field.type === 'handleCount') return 0;
  if (field.type === 'keyValue') return [];
  return '';
}

// Initialize handles from template
function initializeHandles(template: NodeTemplateConfig): {
  inputs: HandleDefinition[];
  outputs: HandleDefinition[];
} {
  const handles = template.handles || [];

  return {
    inputs: handles
      .filter(h => h.kind === 'input')
      .map(h => ({
        id: h.id,
        kind: 'input' as const,
        type: h.type || 'any',
        label: h.label || h.id,
        side: h.side,
        required: false,
        testData: {},
        connected: false,
      })),
    outputs: handles
      .filter(h => h.kind === 'output')
      .map(h => ({
        id: h.id,
        kind: 'output' as const,
        type: h.type || 'any',
        label: h.label || h.id,
        side: h.side,
        fired: false,
      })),
  };
}

export function NodeActionDialog({
  template,
  node,
  isOpen,
  onClose,
  onSubmit,
}: NodeActionDialogProps) {
  const action = template.action;
  const existing =
    (node.data as { actionState?: Record<string, unknown> })?.actionState ??
    {};

  // Field values
  const [values, setValues] = useState<FieldValues>(() => {
    const initial: FieldValues = {};
    if (action) {
      for (const field of action.fields) {
        initial[field.id] = getInitialValue(field, existing[field.id]);
      }
    }
    return initial;
  });

  // Field validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  // Handles (inputs/outputs)
  const [handles, setHandles] = useState<{
    inputs: HandleDefinition[];
    outputs: HandleDefinition[];
  }>(() => initializeHandles(template));

  // Execution state
  const [execution, setExecution] = useState<ExecutionState>({
    status: 'idle',
  });

  // Tab state
  const tabs = useMemo(() => {
    return action?.tabs || ['logic'];
  }, [action]);

  const [activeTab, setActiveTab] = useState(tabs[0]);

  // Expanded handles (accordion state)
  const [expandedInputs, setExpandedInputs] = useState<Set<string>>(
    () => new Set(handles.inputs.slice(0, 1).map(h => h.id)) // First input expanded
  );

  const [expandedOutputs, setExpandedOutputs] = useState<Set<string>>(
    () => new Set()
  );

  // START node specific state
  const isStartNode = template.nodeId === 'START';
  const [inputSchema, setInputSchema] = useState<TypeSchema>(() => {
    if (isStartNode && existing.inputSchema) {
      return existing.inputSchema as TypeSchema;
    }
    return { type: 'any' };
  });

  if (!isOpen || !action) return null;

  const hasErrors = Object.values(errors).some(e => e !== null && e !== undefined);

  const handleChange = (fieldId: string, value: any) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleValidation = (fieldId: string, error: string | null) => {
    setErrors((prev) => ({ ...prev, [fieldId]: error }));
  };

  /**
   * Infer schema from sample payload
   *
   * WHY THIS FEATURE?
   * - Saves user time (don't manually build schema)
   * - Reduces errors (schema matches actual data)
   * - Educational (user sees how schema describes their data)
   */
  const handleInferSchema = () => {
    const samplePayload = values['samplePayload'];

    if (!samplePayload) {
      alert('Please enter sample payload first');
      return;
    }

    try {
      const parsed =
        typeof samplePayload === 'string'
          ? JSON.parse(samplePayload)
          : samplePayload;

      const inferred = inferSchema(parsed);
      setInputSchema(inferred);

      // Update values to save schema in config
      handleChange('inputSchema', inferred);
    } catch (e) {
      alert('Invalid JSON in sample payload');
    }
  };

  const handleUpdateTestData = (handleId: string, data: any) => {
    setHandles(prev => ({
      ...prev,
      inputs: prev.inputs.map(h =>
        h.id === handleId ? { ...h, testData: data } : h
      ),
    }));
  };

  const toggleExpandInput = (handleId: string) => {
    setExpandedInputs(prev => {
      const next = new Set(prev);
      if (next.has(handleId)) next.delete(handleId);
      else next.add(handleId);
      return next;
    });
  };

  const toggleExpandOutput = (handleId: string) => {
    setExpandedOutputs(prev => {
      const next = new Set(prev);
      if (next.has(handleId)) next.delete(handleId);
      else next.add(handleId);
      return next;
    });
  };

  // Execute node with validation and real execution logic
  const handleExecute = async () => {
    // 1. Validate all inputs
    const inputValidations = validateAllInputs(handles.inputs);
    const hasValidationErrors = inputValidations.some(v => !v.valid);

    if (hasValidationErrors) {
      // Update handles with validation errors
      setHandles(prev => ({
        ...prev,
        inputs: prev.inputs.map((h, i) => ({
          ...h,
          validationError: inputValidations[i].valid ? undefined : inputValidations[i].error,
        })),
      }));
      setExecution({ status: 'error', error: 'Please fix input validation errors' });
      return;
    }

    // 2. Start execution
    const startTime = Date.now();
    setExecution({ status: 'running', startTime });

    try {
      // 3. Prepare inputs for backend (convert testData to array format)
      const backendInputs: Record<string, unknown[]> = {};
      handles.inputs.forEach(input => {
        backendInputs[input.id] = input.testData ? [input.testData] : [];
      });

      // 4. Execute node via backend API
      const result = await executeNodeBackend({
        nodeId: node.id,
        templateId: template.nodeId,
        templateVersion: '1.0.0',
        inputs: backendInputs as Record<string, InputValue[]>,
        config: values,
      });

      // 5. Check if execution was successful
      if (!result.success) {
        throw new Error(result.error?.message || 'Execution failed');
      }

      // 6. Update outputs with results
      setHandles(prev => ({
        ...prev,
        outputs: prev.outputs.map(output => ({
          ...output,
          fired: result.executedHandles.includes(output.id),
          outputData: result.outputs[output.id]?.[0] || null,
        })),
      }));

      const duration = Date.now() - startTime;
      setExecution({
        status: 'success',
        duration,
      });

      // Log metadata to console for debugging
      console.log('Execution metadata:', result.metadata);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setExecution({ status: 'error', error: errorMessage });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check required fields
    const newErrors: ValidationErrors = {};
    let hasRequiredErrors = false;

    for (const field of action.fields) {
      if (field.required) {
        const value = values[field.id];
        const isEmpty = value === '' || value === null || value === undefined;
        if (isEmpty) {
          newErrors[field.id] = `${field.label} is required`;
          hasRequiredErrors = true;
        }
      }
    }

    if (hasRequiredErrors) {
      setErrors(newErrors);
      return;
    }

    // Only submit if no validation errors from fields
    if (!hasErrors) {
      onSubmit(values);
      onClose();
    }
  };

  // Filter fields by tab
  const fieldsForCurrentTab = useMemo(() => {
    return action.fields.filter(field => {
      const fieldTab = field.tab || 'logic'; // Default to 'logic' tab
      return fieldTab === activeTab;
    });
  }, [action.fields, activeTab]);

  const renderField = (field: ActionField) => {
    const fieldProps = {
      field,
      value: values[field.id],
      onChange: handleChange,
      onValidation: handleValidation,
    };

    switch (field.type) {
      case 'boolean':
        return <BooleanField {...fieldProps} />;
      case 'text':
        return <TextField {...fieldProps} />;
      case 'enum':
        return <EnumField {...fieldProps} />;
      case 'url':
        return <UrlField {...fieldProps} />;
      case 'httpMethod':
        return <HttpMethodField {...fieldProps} />;
      case 'json':
        return <JsonField {...fieldProps} />;
      case 'code':
        return <CodeField {...fieldProps} />;
      case 'keyValue':
        return <KeyValueField {...fieldProps} />;
      case 'secretRef':
        return <SecretRefField {...fieldProps} />;
      case 'credentialRef':
        return <CredentialRefField {...fieldProps} />;
      case 'fileRef':
        return <FileRefField {...fieldProps} />;
      case 'modelRef':
        return <ModelRefField {...fieldProps} />;
      case 'handleCount':
        return <HandleCountField {...fieldProps} />;
      case 'handleLabels':
        return <HandleLabelsField {...fieldProps} />;
      case 'handleTypes':
        return <HandleTypesField {...fieldProps} />;
      case 'inlineText':
        return <InlineTextField {...fieldProps} />;
      case 'triggerInvokeInfo':
        return <TriggerInvokeInfoField {...fieldProps} />;
      case 'textarea':
        return (
          <div className="space-y-1">
            <label className="label-sm" htmlFor={field.id}>
              {field.label}
            </label>
            <textarea
              id={field.id}
              className="input h-24 resize-none"
              value={String(values[field.id] ?? '')}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          </div>
        );
      case 'number':
        return (
          <div className="space-y-1">
            <label className="label-sm" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              id={field.id}
              className="input"
              type="number"
              value={values[field.id] ?? ''}
              onChange={(e) => handleChange(field.id, Number(e.target.value))}
            />
          </div>
        );
      case 'string':
      default:
        return (
          <div className="space-y-1">
            <label className="label-sm" htmlFor={field.id}>
              {field.label}
            </label>
            <input
              id={field.id}
              className="input"
              type="text"
              value={String(values[field.id] ?? '')}
              onChange={(e) => handleChange(field.id, e.target.value)}
            />
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="app-card w-[90vw] max-w-[1400px] h-[90vh] p-4 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold">
              {action.title} 
            </h2>
            {action.description && (
              <p className="text-xs-muted">{action.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExecute}
              disabled={execution.status === 'running'}
              className="btn-primary px-4 py-1.5 text-xs"
            >
              {execution.status === 'running' ? 'Executing...' : '▶ Execute Node'}
            </button>
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
        <div className="flex-1 min-h-0">
          <ThreePanelLayout>
            <LeftPanel
              handles={handles.inputs}
              onUpdateTestData={handleUpdateTestData}
              expandedHandles={expandedInputs}
              onToggleExpand={toggleExpandInput}
            />

            <MiddlePanel
              activeTab={activeTab}
              onTabChange={setActiveTab}
              tabs={tabs}
            >

              {/* Logic/Advanced tabs */}
              {activeTab !== 'handles' && (
                <>
                  {/* Show variables panel if there are inputs */}
                  {activeTab === 'logic' && handles.inputs.length > 0 && (
                    <div className="border border-slate-700 rounded-lg overflow-hidden mb-4">
                      <div className="p-3">
                        <div className="text-sm font-medium mb-2">Available Variables</div>
                        <div className="space-y-1">
                          {handles.inputs.map((handle, index) => (
                            <div
                              key={handle.id}
                              className="flex items-center justify-between text-xs"
                            >
                              <code className="text-sky-400">
                                inputs[{index}]
                              </code>
                              <span className="text-slate-400">
                                ({handle.type} from {handle.label})
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(`inputs[${index}]`);
                                }}
                                className="btn-ghost px-2 py-0.5 text-xs"
                              >
                                Insert
                              </button>
                            </div>
                          ))}
                          <p className="text-xs text-slate-500 mt-2">
                            Use <code className="text-sky-400">inputs[0]</code>, <code className="text-sky-400">inputs[1]</code> etc. in your code
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Render fields for current tab */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* START node special UI */}
                    {isStartNode && activeTab === 'logic' ? (
                      <div className="space-y-4">
                        {/* Sample Payload */}
                        {fieldsForCurrentTab.map((field) => (
                          <div key={field.id}>{renderField(field)}</div>
                        ))}

                        {/* Infer Schema Button */}
                        <button
                          type="button"
                          onClick={handleInferSchema}
                          className="btn-ghost text-sm px-3 py-1.5"
                        >
                          ✨ Infer Schema from Sample
                        </button>

                        {/* Schema Editor */}
                        <div className="border border-slate-700 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-3">
                            <label className="text-sm font-medium">
                              Input Schema
                            </label>
                            <label className="flex items-center gap-1 text-xs">
                              <input
                                type="checkbox"
                                checked={values['enforceSchema'] || false}
                                onChange={(e) =>
                                  handleChange('enforceSchema', e.target.checked)
                                }
                                className="rounded"
                              />
                              Enforce at runtime
                            </label>
                          </div>

                          <SchemaBuilder
                            schema={inputSchema}
                            onChange={(schema) => {
                              setInputSchema(schema);
                              handleChange('inputSchema', schema);
                            }}
                          />
                        </div>

                        {/* Help text */}
                        <div className="bg-blue-900/20 border border-blue-700 rounded p-3 text-xs">
                          <div className="font-medium mb-1">💡 About Input Schema</div>
                          <p className="text-slate-300">
                            Define the structure of data your workflow expects. This
                            validates runtime input and provides type hints.
                          </p>
                        </div>
                      </div>
                    ) : fieldsForCurrentTab.length === 0 ? (
                      <p className="text-xs text-slate-500">No fields in this tab</p>
                    ) : (
                      fieldsForCurrentTab.map((field) => (
                        <div key={field.id}>{renderField(field)}</div>
                      ))
                    )}
                  </form>
                </>
              )}

              {/* Handles Tab */}
              {activeTab === 'handles' && (
                <HandlesTab
                  template={template}
                  handles={handles}
                  onUpdateHandles={setHandles}
                />
              )}
            </MiddlePanel>

            <RightPanel
              handles={handles.outputs}
              execution={execution}
              expandedHandles={expandedOutputs}
              onToggleExpand={toggleExpandOutput}
            />
          </ThreePanelLayout>
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
            onClick={handleSubmit}
            className="btn-primary px-4 py-1.5 text-xs"
            disabled={hasErrors}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
