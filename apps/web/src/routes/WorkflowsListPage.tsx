import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWorkflows, useCreateWorkflow, useDeleteWorkflow } from '../hooks/useWorkflows';
import type { Workflow } from '@n8n-project/shared';

export function WorkflowsListPage() {
  const navigate = useNavigate();

  const { workflows, isLoading, error } = useWorkflows();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [workflowToDelete, setWorkflowToDelete] = useState<Workflow | null>(null);

  const createMutation = useCreateWorkflow();
  const deleteMutation = useDeleteWorkflow();

  const handleCreateSuccess = (wf: Workflow) => {
    setIsCreateOpen(false);
    setName('');
    setDescription('');
    navigate(`/workflows/${wf.id}`);
  };

  const onCreateSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate({ name, description }, {
      onSuccess: handleCreateSuccess,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="heading-page">Workflows</h2>
        <button
          type="button"
          className="btn btn-primary px-3 py-1.5 text-xs"
          onClick={() => setIsCreateOpen(true)}
        >
          + Add
        </button>
      </div>

      {isLoading && <p className="text-muted">Loading…</p>}
      {error && <p className="text-sm text-red-400">Failed to load workflows.</p>}

      <div className="space-y-2">
        {workflows.map((wf: Workflow) => (
          <div
            key={wf.id}
            className="app-card px-4 py-3 flex items-center justify-between"
          >
            <div>
              <div className="flex items-center gap-2">
                <Link
                  to={`/workflows/${wf.id}`}
                  className="text-sm font-medium hover:text-blue-400"
                >
                  {wf.name}
                </Link>
                <span className="text-[10px] uppercase text-slate-500">
                  {new Date(wf.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs-muted mt-1">{wf.description}</p>
            </div>

            <button
              onClick={() => setWorkflowToDelete(wf)}
              className="btn-danger px-3 py-1 text-xs"
            >
              Delete
            </button>
          </div>
        ))}

        {!isLoading && workflows.length === 0 && (
          <p className="text-muted">
            No workflows yet. Click “Add” to create one.
          </p>
        )}
      </div>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="app-card max-w-lg w-full p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold mb-1">New workflow</h2>
                <p className="text-xs-muted">Create and open the editor.</p>
              </div>
              <button
                type="button"
                className="btn px-2 py-0.5 text-xs border border-slate-700"
                onClick={() => setIsCreateOpen(false)}
                disabled={createMutation.isPending}
              >
                Close
              </button>
            </div>

            <form onSubmit={onCreateSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="label-sm" htmlFor="wf-name">
                  Name
                </label>
                <input
                  id="wf-name"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="My new workflow"
                  required
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="space-y-1">
                <label className="label-sm" htmlFor="wf-desc">
                  Description
                </label>
                <input
                  id="wf-desc"
                  className="input"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  disabled={createMutation.isPending}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn px-3 py-1 text-xs border border-slate-700"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={createMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-4 py-1.5 text-xs"
                  disabled={createMutation.isPending}
                >
                  Create & go
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {workflowToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="app-card max-w-sm w-full p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h2 className="text-sm font-semibold mb-1">Delete workflow?</h2>
                <p className="text-xs-muted">
                  This will permanently delete{' '}
                  <span className="font-semibold text-slate-100">
                    {workflowToDelete.name}
                  </span>
                  . This action cannot be undone.
                </p>
              </div>
              <button
                type="button"
                className="btn px-2 py-0.5 text-xs border border-slate-700"
                onClick={() => setWorkflowToDelete(null)}
                disabled={deleteMutation.isPending}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="btn px-3 py-1 text-xs border border-slate-700"
                onClick={() => setWorkflowToDelete(null)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-danger px-4 py-1.5 text-xs"
                onClick={() => {
                  if (!workflowToDelete) return;
                  deleteMutation.mutate(workflowToDelete.id, {
                    onSettled: () => setWorkflowToDelete(null),
                  });
                }}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {createMutation.isPending && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/80">
          <div className="app-card px-4 py-3 text-sm text-slate-100">
            Creating workflow…
          </div>
        </div>
      )}
    </div>
  );
}
