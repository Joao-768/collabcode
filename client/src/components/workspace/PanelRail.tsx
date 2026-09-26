import { LuChevronLeft, LuChevronRight } from 'react-icons/lu'

type PanelRailProps = {
    label: string
    side: 'left' | 'right'
    onExpand: () => void
}

// What a side panel collapses into: a narrow strip with an arrow pointing the
// way the panel will open, and its name set vertically so it is still findable.
export function PanelRail({ label, side, onExpand }: PanelRailProps) {
    const Arrow = side === 'left' ? LuChevronRight : LuChevronLeft

    return (
        <button
            onClick={onExpand}
            aria-label={`Show ${label.toLowerCase()}`}
            className={`group flex h-full w-10 shrink-0 flex-col items-center gap-4 bg-canvas py-3 text-dim transition-colors hover:bg-surface hover:text-cream ${
                side === 'left' ? 'border-r border-border' : 'border-l border-border'
            }`}
        >
            <span className="grid size-6 place-items-center rounded-md transition-colors group-hover:bg-surface-raised">
                <Arrow className="size-3.5" />
            </span>
            <span className="label [writing-mode:vertical-rl]">{label}</span>
        </button>
    )
}
