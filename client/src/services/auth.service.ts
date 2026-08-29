import { api } from './api'
import type { User } from '@/types'

export function register(email: string, name: string, password: string) {
    return api.post<{ user: User }>('/auth/register', { email, name, password })
}

export function login(email: string, password: string) {
    return api.post<{ user: User }>('/auth/login', { email, password })
}

export function logout() {
    return api.post<void>('/auth/logout')
}

export function me() {
    return api.get<{ user: User }>('/auth/me')
}
