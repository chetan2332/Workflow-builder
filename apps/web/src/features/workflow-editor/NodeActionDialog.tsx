import { useState, type FormEvent } from 'react';
import type { Node } from '@xyflow/react';
import type { NodeTemplateConfig, ActionField } from '../../nodeConfigSchema';

type NodeActionDialogProps = {
  template: NodeTemplateConfig;
  node: Node;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (nextState: Record<string, unknown>) => void;
};

function getInitialValue(field: ActionField, current: unknown) {
  if (current !== undefined && current !== null) {
    return String(current);
  }
  if (field.defaultValue !== undefined) {
    return String(field.defaultValue);
  }
  console.error('Missing default value for field and no current value provided');
  return '';
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

  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    if (action) {
      for (const field of action.fields) {
        initial[field.id] = getInitialValue(field, existing[field.id]);
      }
    }
    return initial;
  });

  if (!isOpen || !action) return null;

  const handleChange = (fieldId: string, value: string) => {
    setValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const next: Record<string, unknown> = {};
    for (const field of action.fields) {
      const raw = values[field.id];
      if (field.type === 'number') {
        const parsed = Number(raw);
        next[field.id] = Number.isNaN(parsed) ? undefined : parsed;
      } else {
        next[field.id] = raw;
      }
    }
    onSubmit(next);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="app-card max-w-lg w-full p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold mb-1">
              {action.title} ({template.name})
            </h2>
            {action.description && (
              <p className="text-xs-muted">{action.description}</p>
            )}
          </div>
          <button
            type="button"
            className="btn px-2 py-0.5 text-xs border border-slate-700"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {action.fields.map((field) => (
            <div key={field.id} className="space-y-1">
              <label className="label-sm" htmlFor={field.id}>
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  id={field.id}
                  className="input h-24 resize-none"
                  value={values[field.id] ?? ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  id={field.id}
                  className="input"
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={values[field.id] ?? ''}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </div>
          ))}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              className="btn px-3 py-1 text-xs border border-slate-700"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary px-4 py-1.5 text-xs"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

