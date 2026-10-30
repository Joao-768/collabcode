// Production: https://api.joao-caetano.com/collabcode/api (.env.production), a
// different origin on the same site, so the auth cookie still travels with
// credentials: 'include'. Development: the Vite dev server proxies /api.
const API_URL = import.meta.env.VITE_API_URL ?? '/api'

export class ApiError extends Error {
    status: number

    constructor(message: string, status: number) {
        super(message)
        this.name = 'ApiError'
        this.status = status
    }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (response.status === 204) {
        return undefined as T
    }

    const data = await response.json().catch(() => ({}))

    if (!response.ok) {
        throw new ApiError(data.error ?? 'Something went wrong', response.status)
    }

    return data as T
}

export const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
    patch: <T>(path: string, body?: unknown) =>
        request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
    delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
