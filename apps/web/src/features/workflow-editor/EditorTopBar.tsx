type EditorTopBarProps = {
  workflowId?: string;
  workflowName?: string;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  onRun?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isRunning?: boolean;
  hasUnsavedChanges?: boolean;
};

export function EditorTopBar({
  workflowId,
  workflowName,
  status = 'DRAFT',
  onRun,
  onSave,
  isSaving,
  isRunning,
  hasUnsavedChanges,
}: EditorTopBarProps) {
  const statusLabel = status.toLowerCase();
  const statusClasses =
    status === 'ACTIVE'
      ? 'border-emerald-500/50 text-emerald-300'
      : status === 'ARCHIVED'
      ? 'border-slate-500/50 text-slate-300'
      : 'border-amber-500/50 text-amber-300';

  // Determine save status text and styling
  const saveStatusText = isSaving
    ? 'Saving...'
    : hasUnsavedChanges
    ? 'Unsaved changes'
    : 'All changes saved';

  const saveStatusClasses = isSaving
    ? 'text-blue-400'
    : hasUnsavedChanges
    ? 'text-amber-400'
    : 'text-emerald-400';

  return (
    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div>
        <p className="text-[11px] text-slate-400">
          Workflows / {workflowName ?? 'Untitled workflow'}
        </p>
        <p className="text-sm font-medium">
          {workflowId ? `Workflow #${workflowId}` : 'New workflow'}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <span className={`text-[11px] ${saveStatusClasses}`}>
          {saveStatusText}
        </span>
        <span
          className={`inline-flex items-center rounded-full border px-2 py-[2px] text-[10px] ${statusClasses}`}
        >
          {statusLabel}
        </span>
        <button
          className="btn btn-primary px-4 py-1.5 text-xs"
          onClick={onRun}
          disabled={isRunning}
        >
          {isRunning ? 'Running…' : 'Run'}
        </button>
        <button
          className="btn px-3 py-1 text-xs border border-slate-700"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}