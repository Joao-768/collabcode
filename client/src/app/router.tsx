import { createBrowserRouter } from 'react-router-dom'
import { LandingPage } from '@/pages/LandingPage'
import { LoginPage } from '@/pages/LoginPage'
import { RegisterPage } from '@/pages/RegisterPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { NotFoundPage } from '@/pages/NotFoundPage'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { WorkspacePage } from '@/pages/WorkspacePage'

export const router = createBrowserRouter([
    { path: '/', element: <LandingPage /> },
    { path: '/login', element: <LoginPage /> },
    { path: '/register', element: <RegisterPage /> },
    {
        element: <ProtectedRoute />,
        children: [
            { path: '/dashboard', element: <DashboardPage /> },
            { path: '/workspace/:id', element: <WorkspacePage /> },
        ],
    },
    { path: '*', element: <NotFoundPage /> },
])
