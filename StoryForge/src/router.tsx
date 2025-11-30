import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './components/Layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: 'project/:projectId/*',
                element: <ProjectWorkspacePage />,
            },
        ],
    },
]);
