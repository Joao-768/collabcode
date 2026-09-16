import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/authContext'
import { Spinner } from '@/components/ui/Spinner'

export function ProtectedRoute() {
    const { user, loading } = useAuth()

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
