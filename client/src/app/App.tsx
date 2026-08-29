import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from '@/app/router'
import { useAuthStore } from '@/stores/auth.store'

export function App() {
    const fetchMe = useAuthStore((s) => s.fetchMe)

    useEffect(() => {
        void fetchMe()
    }, [fetchMe])

    return <RouterProvider router={router} />
}
