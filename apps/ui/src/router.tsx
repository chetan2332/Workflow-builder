import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppShell } from './shell/AppShell';
import { WorkflowsListPage } from './routes/WorkflowsListPage';
import { WorkflowEditorPage } from './routes/WorkflowEditorPage';
import { ExecutionsPage } from './routes/ExecutionsPage';
import { LoginPage } from './routes/LoginPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <WorkflowsListPage /> },
      { path: 'workflows', element: <WorkflowsListPage /> },
      { path: 'workflows/:id', element: <WorkflowEditorPage /> },
      { path: 'executions', element: <ExecutionsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
