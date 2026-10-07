// Theme preference: 'system' follows the OS, 'light' and 'dark' override it.
// public/theme.js applies the saved choice before React loads; this module
// keeps it in sync afterwards and tells subscribers (the Monaco editor) when
// the resolved theme changes.

import { useSyncExternalStore } from 'react'

export type ThemeMode = 'system' | 'light' | 'dark'
export type ResolvedTheme = 'light' | 'dark'

const STORAGE_KEY = 'cc-theme'
const media = window.matchMedia('(prefers-color-scheme: dark)')
const listeners = new Set<() => void>()

export function readThemeMode(): ThemeMode {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        return saved === 'light' || saved === 'dark' ? saved : 'system'
    } catch {
        return 'system'
    }
}

function resolve(mode: ThemeMode): ResolvedTheme {
    return mode === 'dark' || (mode === 'system' && media.matches) ? 'dark' : 'light'
}

function apply(mode: ThemeMode) {
    document.documentElement.setAttribute('data-theme', resolve(mode))
    listeners.forEach((listener) => listener())
}

export function setThemeMode(mode: ThemeMode) {
    try {
        if (mode === 'system') localStorage.removeItem(STORAGE_KEY)
        else localStorage.setItem(STORAGE_KEY, mode)
    } catch {
        // Storage unavailable (private mode): the choice lasts for this page only.
    }
    apply(mode)
}

// Follow OS changes while the preference is "system".
media.addEventListener('change', () => {
    if (readThemeMode() === 'system') apply('system')
})

function subscribe(listener: () => void) {
    listeners.add(listener)
    return () => {
        listeners.delete(listener)
    }
}

export function useThemeMode(): ThemeMode {
    return useSyncExternalStore(subscribe, readThemeMode)
}

export function useResolvedTheme(): ResolvedTheme {
    return useSyncExternalStore(subscribe, () =>
        document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
    )
}
