import { History } from 'lucide-react';

export function ExecutionsPage() {
  return (
    <div style={{ maxWidth: 720 }} className="animate-in">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: '1.375rem',
          fontWeight: 600, letterSpacing: '-0.025em', color: 'var(--text-1)', marginBottom: 4,
        }}>Executions</h1>
        <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
          History of all workflow runs.
        </p>
      </div>

      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '5rem 2rem', gap: 12, textAlign: 'center',
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'var(--surface-2)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <History size={20} style={{ color: 'var(--text-3)' }} />
        </div>
        <div>
          <p style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--text-1)', marginBottom: 4 }}>
            Execution history coming soon
          </p>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-2)' }}>
            All workflow runs will appear here once you execute a workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
