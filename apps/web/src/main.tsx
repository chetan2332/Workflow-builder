import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouter } from './router.tsx';
import { AuthProvider } from "react-oidc-context"

const cognitoAuthConfig = {
  authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_EO3mZjvlY",
  client_id: "fa20c4t3ctkiivkp8tea9p4vj",
  redirect_uri: "http://localhost:5173/",
  response_type: "code",
  scope: "email openid profile",
};

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <QueryClientProvider client={queryClient}>
        <AppRouter />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
