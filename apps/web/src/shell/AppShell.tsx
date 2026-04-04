import { Link, Outlet, useLocation } from 'react-router-dom';

export function AppShell() {
  const location = useLocation();
  const isEditorRoute = location.pathname.startsWith('/workflows/');

  if (isEditorRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Outlet />
      </div>
    );
  }

  // Normal (lists, etc.)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/workflows" className="text-sm font-semibold tracking-tight">
            Automation Workflow Builder
          </Link>
          {/* <span className="text-xs-muted">Frontend v0.1</span> */}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}