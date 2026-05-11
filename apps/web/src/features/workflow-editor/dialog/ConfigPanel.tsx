import { useState } from 'react';
import type { WorkflowNode } from '@n8n-project/shared';
import { getFieldComponent } from '../fields';

interface ConfigPanelProps {
  nodeData: WorkflowNode;
  configValues: Record<string, any>;
  onConfigChange: (id: string, value: any) => void;
}

export function ConfigPanel({ nodeData, configValues, onConfigChange }: ConfigPanelProps) {
  const fields = nodeData.config?.fields ?? [];
  const tabs = nodeData.config?.tabs;
  const [activeTab, setActiveTab] = useState(tabs?.[0] ?? 'config');

  // Filter fields by active tab (if tabs exist)
  const visibleFields = tabs
    ? fields.filter(f => (f.tab ?? 'config') === activeTab)
    : fields;

  // No fields to show
  if (fields.length === 0) {
    return (
      <div className="flex-1 border border-slate-700 rounded-lg p-4 overflow-y-auto">
        <h3 className="text-sm font-semibold mb-4">CONFIGURATION</h3>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-sm text-slate-400">No configuration for this node</p>
          <div className="text-xs text-slate-500 mt-2">
            <p>Type: {nodeData.type} v{nodeData.version}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 border border-slate-700 rounded-lg overflow-hidden flex flex-col">
      {/* Tabs (if defined) */}
      {tabs && tabs.length > 1 && (
        <div className="flex border-b border-slate-700 bg-slate-900/50">
          {tabs.map(tab => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-slate-800 text-slate-100 border-b-2 border-sky-500'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      )}

      {/* Fields */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {visibleFields.map(field => {
          const FieldComponent = getFieldComponent(field.type);

          if (!FieldComponent) {
            return (
              <div key={field.id} className="text-xs text-amber-400">
                Unknown field type: {field.type}
              </div>
            );
          }

          return (
            <FieldComponent
              key={field.id}
              field={field}
              value={configValues[field.id]}
              onChange={onConfigChange}
            />
          );
        })}
      </div>
    </div>
  );
}
