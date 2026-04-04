import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { WorkflowsListPage } from './routes/WorkflowsListPage';
import { WorkflowEditorPage } from './routes/WorkflowEditorPage';
import { AppShell } from './shell/AppShell';
// import { WorkflowEditorPage } from './routes/WorkflowEditorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <WorkflowsListPage />,
      },
      {
        path: 'workflows',
        element: <WorkflowsListPage />,
      },
      {
        path: 'workflows/:id',
        element: <WorkflowEditorPage />,
      },
    ]
  }
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}