import { GROUPED_TEMPLATES, NODE_TYPE_LABELS } from '../../nodeTemplates';

interface NodePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectNode: (definitionId: string) => void;
}

export function NodePickerModal({
  isOpen,
  onClose,
  onSelectNode,
}: NodePickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="app-card p-4 w-[600px] max-h-[80vh] overflow-y-auto">
        {/* Header with close button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Node</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {GROUPED_TEMPLATES.map((group) => (
          <div key={group.type} className="mb-6">
            <h3 className="text-sm font-medium text-slate-400 mb-2">
              {NODE_TYPE_LABELS[group.type]}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {group.templates.map((template) => (
                <button
                  key={template.nodeId}
                  onClick={() => onSelectNode(template.nodeId)}
                  className="btn-ghost p-3 text-left hover:bg-slate-800"
                >
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-slate-500">
                    {template.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
