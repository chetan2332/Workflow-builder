import { useEffect } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from 'react-oidc-context';
import { setAuthToken } from '../api/client';
import { syncUser } from '../api/auth';
import { Workflow, History, Settings, LogOut, Zap, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

const CLIENT_ID = 'fa20c4t3ctkiivkp8tea9p4vj';
const COGNITO_DOMAIN = 'https://eu-north-1eo3mzjvly.auth.eu-north-1.amazoncognito.com';
const LOGOUT_URI = typeof window !== 'undefined' ? `${window.location.origin}/` : 'http://localhost:5174/';

function signOutRedirect() {
  window.location.href = `${COGNITO_DOMAIN}/logout?client_id=${CLIENT_ID}&logout_uri=${encodeURIComponent(LOGOUT_URI)}`;
}

export function AppShell() {
  const auth = useAuth();
  const location = useLocation();
  const isEditorRoute = /^\/workflows\/.+/.test(location.pathname);
  const { theme, toggle } = useTheme();

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

  /* ── Loading ── */
  if (auth.isLoading) {
    return (
      <div style={{ minHeight: '100svh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-3)' }}>
          Loading…
        </span>
      </div>
    );
  }

  /* ── Auth error ── */
  if (auth.error) {
    return (
      <div style={{ minHeight: '100svh', backgroundColor: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--danger)' }}>{auth.error.message}</span>
      </div>
    );
  }

  /* ── Sign-in ── */
  if (!auth.isAuthenticated) {
    return (
      <div style={{
        minHeight: '100svh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}>
        {/* Theme toggle — top right */}
        <button
          onClick={toggle}
          className="btn-icon"
          style={{ position: 'fixed', top: 16, right: 16 }}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
        >
          {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
        </button>

        <div style={{
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 24,
          width: '100%',
          maxWidth: 340,
        }}>
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'var(--accent-dim)',
              border: '1.5px solid var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={16} style={{ color: 'var(--accent)' }} strokeWidth={2.5} />
            </div>
            <span style={{
              fontFamily: 'var(--font-display)', fontWeight: 600,
              fontSize: 18, letterSpacing: '-0.025em', color: 'var(--text-1)',
            }}>
              flowstack
            </span>
          </div>

          {/* Tagline */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 500,
              letterSpacing: '-0.02em', color: 'var(--text-1)', lineHeight: 1.25,
              marginBottom: 6,
            }}>
              Automate anything.
            </p>
            <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>
              Sign in to build and run your workflows.
            </p>
          </div>

          {/* Google SSO button */}
          <button
            onClick={() => auth.signinRedirect()}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', justifyContent: 'center', borderRadius: 10 }}
          >
            <GoogleLogo />
            Continue with Google
          </button>

          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)', letterSpacing: '0.04em', textAlign: 'center' }}>
            Secured via Amazon Cognito
          </p>
        </div>
      </div>
    );
  }

  /* ── Editor route — full screen, no sidebar ── */
  if (isEditorRoute) {
    return (
      <div style={{ width: '100%', height: '100svh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg)' }}>
        <Outlet />
      </div>
    );
  }

  /* ── Authenticated shell with sidebar ── */
  const email = auth.user?.profile.email ?? '';

  return (
    <div style={{ display: 'flex', width: '100%', height: '100svh', overflow: 'hidden' }}>
      <Sidebar email={email} onSignOut={signOutRedirect} theme={theme} onToggleTheme={toggle} />
      <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 2.5rem', backgroundColor: 'var(--bg)' }}>
        <Outlet />
      </main>
    </div>
  );
}

/* ── Sidebar ── */

function Sidebar({ email, onSignOut, theme, onToggleTheme }: { email: string; onSignOut: () => void; theme: string; onToggleTheme: () => void }) {
  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      padding: '1rem 0.75rem',
    }}>
      {/* Brand */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.125rem 0.5rem 1.25rem' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: 'var(--accent-dim)',
          border: '1.5px solid var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Zap size={13} style={{ color: 'var(--accent)' }} strokeWidth={2.5} />
        </div>
        <span style={{
          fontFamily: 'var(--font-display)', fontWeight: 600,
          fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text-1)',
        }}>flowstack</span>
      </div>

      <div className="t-label" style={{ padding: '0 0.5rem', marginBottom: '0.375rem' }}>Workspace</div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <NavLink to="/workflows" end className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <Workflow size={15} />
          Workflows
        </NavLink>
        <NavLink to="/executions" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <History size={15} />
          Executions
        </NavLink>
      </nav>

      <div style={{ flex: 1 }} />
      <div style={{ height: 1, background: 'var(--border)', margin: '0.75rem 0' }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <button className="nav-item" style={{ opacity: 0.4, cursor: 'not-allowed', pointerEvents: 'none' }}>
          <Settings size={15} />
          Settings
        </button>

        <div style={{ padding: '0.5rem 0.75rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-3)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{email}</span>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button
              onClick={onSignOut}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'none', border: 'none',
                fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                color: 'var(--text-3)', cursor: 'pointer', padding: 0,
                transition: 'color 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-3)')}
            >
              <LogOut size={10} /> sign out
            </button>
            <button
              onClick={onToggleTheme}
              className="btn-icon"
              style={{ padding: '0.2rem' }}
              aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ── Google logo SVG ── */
function GoogleLogo() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="currentColor" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="currentColor" />
    </svg>
  );
}
