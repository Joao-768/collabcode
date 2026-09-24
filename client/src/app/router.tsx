import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'

export const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <DashboardPage /> },
            {
                path: '/workspace/:id',
                // Monaco is most of the bundle, so only fetch it once a project opens.
                lazy: async () => ({
                    Component: (await import('@/pages/WorkspacePage')).WorkspacePage,
                }),
            },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
])
