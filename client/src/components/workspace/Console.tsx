import { LuChevronDown, LuChevronUp, LuTrash2 } from 'react-icons/lu'
import type { ConsoleLine } from '@/lib/runner'

type ConsoleProps = {
    lines: ConsoleLine[]
    onClear: () => void
    input: string
    onInputChange: (value: string) => void
    open: boolean
    onToggle: () => void
}

const LEVEL_CLASS: Record<ConsoleLine['level'], string> = {
    log: 'text-muted',
    info: 'text-muted',
    warn: 'text-amber-400',
    error: 'text-red-400',
    system: 'text-faint',
}

export function Console({ lines, onClear, input, onInputChange, open, onToggle }: ConsoleProps) {
    const Arrow = open ? LuChevronDown : LuChevronUp

    return (
        <section
            className={`flex shrink-0 flex-col border-t border-border bg-canvas ${
                open ? 'h-48 md:h-56' : ''
            }`}
        >
            <div
                className={`flex items-center justify-between px-4 py-2.5 ${
                    open ? 'border-b border-border' : ''
                }`}
            >
                <button
                    onClick={onToggle}
                    aria-label={open ? 'Hide console' : 'Show console'}
                    aria-expanded={open}
                    className="group flex items-center gap-2 text-dim transition-colors hover:text-cream"
                >
                    <span className="grid size-5 place-items-center rounded-md transition-colors group-hover:bg-surface">
                        <Arrow className="size-3.5" />
                    </span>
                    <span className="label">Console</span>
                    {!open && lines.length > 0 && (
                        <span className="font-mono text-[10.5px] text-faint">
                            {lines.length} {lines.length === 1 ? 'line' : 'lines'}
                        </span>
                    )}
                </button>

                {open && lines.length > 0 && (
                    <button
                        onClick={onClear}
                        aria-label="Clear console"
                        className="rounded-md p-1 text-faint transition-colors hover:bg-surface hover:text-cream"
                    >
                        <LuTrash2 className="size-3.5" />
                    </button>
                )}
            </div>

            {open && (
                <>
                    <div className="flex-1 overflow-y-auto px-4 py-3">
                        {lines.length === 0 ? (
                            <p className="m-0 font-mono text-[11.5px] text-faint">
                                Run a JavaScript file to see its output here.
                            </p>
                        ) : (
                            <ul className="m-0 flex list-none flex-col gap-1 p-0">
                                {lines.map((line) => (
                                    <li
                                        key={line.id}
                                        className={`font-mono text-[12px] leading-relaxed whitespace-pre-wrap ${LEVEL_CLASS[line.level]}`}
                                    >
                                        {line.text}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <label className="flex items-center gap-2 border-t border-border px-4 py-2">
                        <span className="label shrink-0 text-dim">Input</span>
                        <input
                            value={input}
                            onChange={(event) => onInputChange(event.target.value)}
                            placeholder="Answers for prompt(), in order: 7, 5"
                            className="w-full rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11.5px] text-cream placeholder:text-faint focus:border-dim focus:outline-none"
                        />
                    </label>
                </>
            )}
        </section>
    )
}
