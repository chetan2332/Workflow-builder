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
      <div
        style={{ minHeight: '100svh', backgroundColor: 'var(--color-bg)' }}
        className="flex items-center justify-center"
      >
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--color-text-faint)' }}>
          Loading…
        </span>
      </div>
    );
  }

  if (auth.error) {
    return (
      <div
        style={{ minHeight: '100svh', backgroundColor: 'var(--color-bg)' }}
        className="flex items-center justify-center"
      >
        <span style={{ fontSize: 13, color: 'var(--color-danger)' }}>
          {auth.error.message}
        </span>
      </div>
    );
  }

  if (!auth.isAuthenticated) {
    return (
      <div
        style={{ minHeight: '100svh', backgroundColor: 'var(--color-bg)' }}
        className="flex items-center justify-center p-4"
      >
        <div
          style={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
          className="rounded-xl p-8 flex flex-col items-center gap-6 w-full max-w-[320px]"
        >
          <div className="flex items-center gap-2">
            <BrandMonogram />
            <BrandWordmark />
          </div>

          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 400,
            color: 'var(--color-text-primary)',
            textAlign: 'center',
            lineHeight: 1.3,
            margin: 0,
          }}>
            Automate anything.
          </p>

          <button
            onClick={() => auth.signinRedirect()}
            className="btn btn-primary w-full py-2 text-sm"
          >
            Continue with SSO
          </button>
        </div>
      </div>
    );
  }

  if (isEditorRoute) {
    return (
      <div style={{ minHeight: '100svh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
        <Outlet />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100svh', backgroundColor: 'var(--color-bg)', color: 'var(--color-text-primary)' }}>
      <header style={{
        height: 44,
        backgroundColor: 'color-mix(in srgb, var(--color-bg) 95%, transparent)',
        borderBottom: '1px solid var(--color-border)',
        backdropFilter: 'blur(8px)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}>
        <div className="h-full max-w-5xl mx-auto px-4 flex items-center justify-between">
          <Link to="/workflows" className="flex items-center gap-2" aria-label="Flowstack home">
            <BrandMonogram />
            <BrandWordmark />
          </Link>
          <div className="flex items-center gap-3">
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-text-secondary)',
              userSelect: 'none',
            }}>
              {auth.user?.profile.email}
            </span>
            <button onClick={signOutRedirect} className="btn-exit">
              exit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

function BrandMonogram() {
  return (
    <div style={{
      width: 22,
      height: 22,
      borderRadius: 3,
      border: '2px solid var(--color-accent)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 600,
        fontSize: 10,
        color: 'var(--color-accent)',
        lineHeight: 1,
        letterSpacing: '-0.03em',
      }}>
        FS
      </span>
    </div>
  );
}

function BrandWordmark() {
  return (
    <span style={{
      fontFamily: 'var(--font-display)',
      fontWeight: 600,
      fontSize: 15,
      color: 'var(--color-text-primary)',
      letterSpacing: '-0.02em',
    }}>
      flowstack
    </span>
  );
}
