import { LuMonitor, LuMoon, LuSun } from 'react-icons/lu'
import { setThemeMode, useThemeMode, type ThemeMode } from '@/lib/theme'

const NEXT: Record<ThemeMode, ThemeMode> = { system: 'light', light: 'dark', dark: 'system' }
const LABEL: Record<ThemeMode, string> = {
    system: 'Theme: follows your system',
    light: 'Theme: light',
    dark: 'Theme: dark',
}
const ICON = { system: LuMonitor, light: LuSun, dark: LuMoon }

/** One button that cycles system, light and dark. The label says the current
 *  mode and that clicking changes it. */
export function ThemeToggle({ className = '' }: { className?: string }) {
    const mode = useThemeMode()
    const Icon = ICON[mode]

    return (
        <button
            type="button"
            onClick={() => setThemeMode(NEXT[mode])}
            title={`${LABEL[mode]}. Click to change.`}
            aria-label={`${LABEL[mode]}. Change theme`}
            className={`grid size-8 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-cream/8 hover:text-cream ${className}`}
        >
            <Icon className="size-3.75" aria-hidden="true" />
        </button>
    )
}
