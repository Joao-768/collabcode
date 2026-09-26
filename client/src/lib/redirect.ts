const DEFAULT_PATH = '/dashboard'

// Where to go after logging in, read from `?next=`. Only same-site paths are
// accepted, so a crafted link cannot bounce someone to another domain.
export function nextPath(search: URLSearchParams): string {
    const next = search.get('next')

    if (!next || !next.startsWith('/') || next.startsWith('//')) return DEFAULT_PATH

    return next
}

// Carries `?next=` across to the other auth page, so switching between log in
// and register does not lose the link someone arrived with.
export function withNext(path: string, search: URLSearchParams): string {
    const next = search.get('next')

    return next ? `${path}?next=${encodeURIComponent(next)}` : path
}
