import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ExternalLink, Workflow } from 'lucide-react';
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow } from '../hooks/useWorkflows';
import type { Workflow as WF } from '@n8n-project/shared';

export function WorkflowsListPage() {
  const navigate = useNavigate();
  const { workflows, isLoading, error } = useWorkflows();
  const createMutation = useCreateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [toDelete, setToDelete] = useState<WF | null>(null);

  const onCreateSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, description }, {
      onSuccess: (wf) => {
        setIsCreateOpen(false);
        setName('');
        setDescription('');
        navigate(`/workflows/${wf.id}`);
      },
    });
  };

  return (
    <div style={{ maxWidth: 720 }} className="animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: '1.375rem',
            fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--text-1)',
            marginBottom: 4,
          }}>Workflows</h1>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
            {isLoading ? 'Loading…' : `${workflows.length} workflow${workflows.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          className="btn btn-primary btn-md"
          onClick={() => setIsCreateOpen(true)}
        >
          <Plus size={14} strokeWidth={2.5} />
          New workflow
        </button>
      </div>

      {/* Error */}
      {error && (
        <div style={{
          padding: '0.75rem 1rem', borderRadius: 8,
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)',
          color: 'var(--danger)', fontSize: '0.8125rem', marginBottom: '1rem',
        }}>
          Failed to load workflows.
        </div>
      )}

      {/* List */}
      {!isLoading && workflows.length === 0 && !error && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', padding: '4rem 2rem', gap: 12, textAlign: 'center',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: 'var(--surface-2)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Workflow size={20} style={{ color: 'var(--text-3)' }} />
          </div>
          <div>
            <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>No workflows yet</p>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>Create your first workflow to get started.</p>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {workflows.map((wf: WF) => (
          <WorkflowRow
            key={wf.id}
            wf={wf}
            onOpen={() => navigate(`/workflows/${wf.id}`)}
            onDelete={() => setToDelete(wf)}
          />
        ))}
      </div>

      {/* Create modal */}
      {isCreateOpen && (
        <Modal onClose={() => setIsCreateOpen(false)}>
          <div style={{ padding: '1.5rem', width: 420 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: 4 }}>
              New workflow
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', marginBottom: '1.25rem' }}>
              Name your workflow and jump into the editor.
            </p>

            <form onSubmit={onCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="input-label" htmlFor="wf-name">Name</label>
                <input id="wf-name" className="input" value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Send welcome email"
                  required disabled={createMutation.isPending} />
              </div>
              <div>
                <label className="input-label" htmlFor="wf-desc">Description <span style={{ color: 'var(--text-3)' }}>(optional)</span></label>
                <input id="wf-desc" className="input" value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="What does this workflow do?"
                  disabled={createMutation.isPending} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 4 }}>
                <button type="button" className="btn btn-ghost btn-md" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-md" disabled={createMutation.isPending || !name.trim()}>
                  {createMutation.isPending ? 'Creating…' : 'Create & open'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete confirm */}
      {toDelete && (
        <Modal onClose={() => setToDelete(null)}>
          <div style={{ padding: '1.5rem', width: 380 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
              Delete workflow?
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-1)' }}>{toDelete.name}</strong> will be permanently deleted. This cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button className="btn btn-ghost btn-md" onClick={() => setToDelete(null)} disabled={deleteMutation.isPending}>
                Cancel
              </button>
              <button
                className="btn btn-danger btn-md"
                disabled={deleteMutation.isPending}
                onClick={() => deleteMutation.mutate(toDelete.id, { onSettled: () => setToDelete(null) })}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function WorkflowRow({ wf, onOpen, onDelete }: { wf: WF; onOpen: () => void; onDelete: () => void }) {
  return (
    <div
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0.875rem 1rem',
        backgroundColor: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 10, cursor: 'pointer', transition: 'border-color 150ms, background 150ms',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--text-3)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--surface-2)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.backgroundColor = 'var(--surface)';
      }}
      onClick={onOpen}
    >
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 600,
            fontSize: '0.9375rem', color: 'var(--text-1)', letterSpacing: '-0.01em',
          }}>{wf.name}</span>
        </div>
        {wf.description && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-2)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {wf.description}
          </p>
        )}
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', marginTop: 4 }}>
          {new Date(wf.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 12 }}>
        <button
          className="btn-icon"
          onClick={e => { e.stopPropagation(); onOpen(); }}
          title="Open editor"
          style={{ color: 'var(--text-3)' }}
        >
          <ExternalLink size={14} />
        </button>
        <button
          className="btn-icon"
          onClick={e => { e.stopPropagation(); onDelete(); }}
          title="Delete"
          style={{ color: 'var(--text-3)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="overlay" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="card animate-in" style={{ boxShadow: '0 16px 48px rgba(0,0,0,0.7)' }}>
        {children}
      </div>
    </div>
  );
}
