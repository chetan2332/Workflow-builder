import { ArrowLeft, Save, Play, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type Status = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

type EditorTopBarProps = {
  workflowName: string;
  status?: Status;
  onRun?: () => void;
  onSave?: () => void;
  isSaving?: boolean;
  isRunning?: boolean;
  hasUnsavedChanges?: boolean;
};

export function EditorTopBar({
  workflowName,
  status = 'DRAFT',
  onRun,
  onSave,
  isSaving,
  isRunning,
  hasUnsavedChanges,
}: EditorTopBarProps) {
  const navigate = useNavigate();

  const saveIcon = isSaving
    ? <span className="animate-spin" style={{ display: 'inline-flex' }}><Clock size={12} /></span>
    : hasUnsavedChanges
    ? <AlertCircle size={12} style={{ color: 'var(--warning)' }} />
    : <CheckCircle2 size={12} style={{ color: 'var(--success)' }} />;

  const saveText = isSaving ? 'Saving…' : hasUnsavedChanges ? 'Unsaved' : 'Saved';
  const saveColor = isSaving ? 'var(--text-2)' : hasUnsavedChanges ? 'var(--warning)' : 'var(--success)';

  const statusBadgeClass = status === 'ACTIVE' ? 'badge-active' : status === 'ARCHIVED' ? 'badge-archived' : 'badge-draft';

  return (
    <div style={{
      height: 48,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1rem',
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      flexShrink: 0,
      gap: 12,
    }}>
      {/* Left: back + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
        <button
          className="btn-icon"
          onClick={() => navigate('/workflows')}
          title="Back to workflows"
        >
          <ArrowLeft size={15} />
        </button>
        <span style={{ color: 'var(--border)', fontSize: 16, userSelect: 'none' }}>/</span>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: '0.9375rem', letterSpacing: '-0.01em', color: 'var(--text-1)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>{workflowName}</span>
        <span className={`badge ${statusBadgeClass}`}>{status.toLowerCase()}</span>
      </div>

      {/* Right: save status + actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {saveIcon}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: saveColor, letterSpacing: '0.04em',
          }}>{saveText}</span>
        </div>

        <div style={{ width: 1, height: 16, background: 'var(--border)' }} />

        <button
          className="btn btn-secondary btn-sm"
          onClick={onSave}
          disabled={isSaving || !hasUnsavedChanges}
        >
          <Save size={13} />
          Save
        </button>

        <button
          className="btn btn-primary btn-sm"
          onClick={onRun}
          disabled={isRunning}
          style={{ gap: 5 }}
        >
          <Play size={12} fill="currentColor" />
          {isRunning ? 'Running…' : 'Run'}
        </button>
      </div>
    </div>
  );
}
