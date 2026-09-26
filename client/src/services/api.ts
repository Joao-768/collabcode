// The API always shares the app's origin: Render serves both in production and
// the Vite dev server proxies it in development, so a relative path works.
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
