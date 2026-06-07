import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { useEffect } from 'react';
import { setAuthToken } from '../api/client';
import { syncUser } from '../api/auth';

const CLIENT_ID = 'fa20c4t3ctkiivkp8tea9p4vj';
const COGNITO_DOMAIN = 'https://eu-north-1eo3mzjvly.auth.eu-north-1.amazoncognito.com';
const LOGOUT_URI = 'http://localhost:5173/';

function signOutRedirect() {
  window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
}

export function AppShell() {
  const auth = useAuth();
  const location = useLocation();
  const isEditorRoute = location.pathname.startsWith('/workflows/');

  if (auth.isAuthenticated && auth.user) {
    setAuthToken(auth.user.id_token ?? null);
  } else {
    setAuthToken(null);
  }

  useEffect(() => {
    if (auth.isAuthenticated && auth.user) {
      syncUser().catch(console.error);
    }
  }, [auth.isAuthenticated, auth.user]);

  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <span className="text-sm text-slate-400">Loading...</span>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <span className="text-sm text-red-400">{auth.error.message}</span>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tight">Automation Workflow Builder</span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <p className="text-slate-400 text-sm">Sign in to manage your workflows.</p>
            <button
              onClick={() => auth.signinRedirect()}
              className="btn btn-primary px-4 py-2 text-sm"
            >
              Sign in
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (isEditorRoute) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50">
        <Outlet />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <Link to="/workflows" className="text-sm font-semibold tracking-tight">
            Automation Workflow Builder
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">{auth.user?.profile.email}</span>
            <button
              onClick={signOutRedirect}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-6">
        <Outlet />
      </main>
    </div>
  );
}
