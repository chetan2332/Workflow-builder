import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from 'react-oidc-context';
import { AppRouter } from './router';

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_EO3mZjvlY',
  client_id: 'fa20c4t3ctkiivkp8tea9p4vj',
  redirect_uri: `${window.location.origin}/`,
  response_type: 'code',
  scope: 'email openid profile',
};

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
