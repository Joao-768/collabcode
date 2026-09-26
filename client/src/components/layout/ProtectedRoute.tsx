import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth.store'
import { Spinner } from '@/components/ui/Spinner'

export function ProtectedRoute() {
    const user = useAuthStore((s) => s.user)
    const loading = useAuthStore((s) => s.loading)
    const location = useLocation()

    if (loading) {
        return (
            <div className="grid min-h-svh place-items-center bg-canvas">
                <Spinner className="size-6" />
            </div>
        )
    }

    if (!user) {
        // Remember where they were headed, so a shared workspace link still
        // lands in the workspace once they have logged in.
        const next = encodeURIComponent(location.pathname + location.search)

        return <Navigate to={`/login?next=${next}`} replace />
    }

    return <Outlet />
}
