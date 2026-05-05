import { useState } from 'react';
import type { FieldProps } from './types';
import type { TypeSchema } from '@n8n-project/shared';
import { inferSchema } from '@n8n-project/shared';
import { CodeMirrorEditor } from './CodeMirrorEditor';
import { SchemaBuilder } from '../dialog/SchemaBuilder';

/**
 * InputField - Combined payload + schema field for START node
 *
 * Value structure: { payload: any, schema: TypeSchema }
 */
export function InputField({ field, value, onChange }: FieldProps) {
  const inputValue = value as { payload?: any; schema?: TypeSchema } | undefined;

  const [payloadString, setPayloadString] = useState<string>(() => {
    if (inputValue?.payload) {
      return typeof inputValue.payload === 'string'
        ? inputValue.payload
        : JSON.stringify(inputValue.payload, null, 2);
    }
    return '';
  });

  const [schema, setSchema] = useState<TypeSchema>(
    () => inputValue?.schema ?? { type: 'any' }
  );

  const [jsonError, setJsonError] = useState<string | null>(null);

  const updateValue = (newPayload: string, newSchema: TypeSchema) => {
    let parsedPayload: any = null;
    try {
      if (newPayload.trim()) {
        parsedPayload = JSON.parse(newPayload);
      }
      setJsonError(null);
    } catch {
      setJsonError('Invalid JSON');
      parsedPayload = newPayload; // Keep as string if invalid
    }

    onChange(field.id, { payload: parsedPayload, schema: newSchema });
  };

  const handlePayloadChange = (val: string) => {
    setPayloadString(val);
    updateValue(val, schema);
  };

  const handleSchemaChange = (newSchema: TypeSchema) => {
    setSchema(newSchema);
    updateValue(payloadString, newSchema);
  };

  const handleInferSchema = () => {
    if (!payloadString.trim()) {
      alert('Enter payload data first');
      return;
    }

    try {
      const parsed = JSON.parse(payloadString);
      const inferred = inferSchema(parsed);
      setSchema(inferred);
      updateValue(payloadString, inferred);
    } catch {
      alert('Invalid JSON - cannot infer schema');
    }
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(payloadString);
      const formatted = JSON.stringify(parsed, null, 2);
      setPayloadString(formatted);
      setJsonError(null);
    } catch {
      setJsonError('Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="label-sm">{field.label}</label>
        {field.description && (
          <p className="text-xs text-slate-400 mt-1">{field.description}</p>
        )}
      </div>

      {/* Payload Editor */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">Sample Payload</span>
          <button
            type="button"
            onClick={handleFormat}
            className="btn-ghost px-2 py-0.5 text-xs"
          >
            Format
          </button>
        </div>

        <CodeMirrorEditor
          value={payloadString}
          language="json"
          onChange={handlePayloadChange}
          height="150px"
          placeholder='{ "example": "data" }'
        />

        {jsonError && <p className="text-xs text-red-400">{jsonError}</p>}
      </div>

      {/* Infer Schema Button */}
      <button
        type="button"
        onClick={handleInferSchema}
        className="btn-ghost text-xs px-3 py-1.5 border border-slate-600"
      >
        ✨ Infer Schema from Payload
      </button>

      {/* Schema Editor */}
      <div className="space-y-1">
        <span className="text-xs text-slate-400">Input Schema</span>
        <div className="border border-slate-700 rounded-lg p-3">
          <SchemaBuilder
            schema={schema}
            onChange={handleSchemaChange}
          />
        </div>
      </div>
    </div>
  );
}
