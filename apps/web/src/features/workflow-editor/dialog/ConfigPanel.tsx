import type { WorkflowNode } from '@n8n-project/shared';

interface ConfigPanelProps {
  nodeData: WorkflowNode;
}

export function ConfigPanel({ nodeData }: ConfigPanelProps) {
  return (
    <div className="flex-1 border border-slate-700 rounded-lg p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-4">CONFIGURATION</h3>

      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-4xl mb-4">🔧</div>
        <p className="text-sm text-slate-400 mb-2">
          Configuration fields coming soon...
        </p>
        <div className="text-xs text-slate-500 space-y-1">
          <p>Node: <span className="text-slate-300">{nodeData.label}</span></p>
          <p>Type: <span className="text-slate-300">{nodeData.type}</span></p>
          <p>Version: <span className="text-slate-300">{nodeData.version}</span></p>
        </div>
      </div>
    </div>
  );
}
