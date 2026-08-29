import { create } from 'zustand'
import type { User } from '@/types'
import * as authService from '@/services/auth.service'

type AuthState = {
    user: User | null
    loading: boolean
    setUser: (user: User | null) => void
    fetchMe: () => Promise<void>
    signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: true,

    setUser: (user) => set({ user }),

    fetchMe: async () => {
        try {
            const { user } = await authService.me()
            set({ user, loading: false })
        } catch {
            set({ user: null, loading: false })
        }
    },

    signOut: async () => {
        await authService.logout()
        set({ user: null })
    },
}))
