import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

type User = {
    id: string
    name: string
    email: string
}

type AuthContextValue = {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) return null
                return response.json()
            })
            .then((data) => {
                setUser(data ? data.user : null)
                setLoading(false)
            })
            .catch(() => {
                setUser(null)
                setLoading(false)
            })
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading, setUser }}>{children}</AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error('useAuth must be used inside an AuthProvider')
    }

    return context
}
