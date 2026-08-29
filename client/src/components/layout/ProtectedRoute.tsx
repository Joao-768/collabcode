import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Spinner } from '@/components/ui/Spinner'

export function ProtectedRoute() {
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)

    if (loading) {
        return (
            <div className="grid min-h-svh place-items-center bg-canvas">
                <Spinner className="size-6" />
            </div>
        )
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}
