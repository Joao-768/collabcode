import { LuTrash2, LuTerminal } from 'react-icons/lu'
import type { ConsoleLine } from '@/lib/runner'

type ConsoleProps = {
    lines: ConsoleLine[]
    onClear: () => void
}

const LEVEL_CLASS: Record<ConsoleLine['level'], string> = {
    log: 'text-muted',
    info: 'text-muted',
    warn: 'text-amber-400',
    error: 'text-red-400',
    system: 'text-dim',
}

export function Console({ lines, onClear }: ConsoleProps) {
    return (
        <section className="flex h-44 shrink-0 flex-col border-t border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <span className="flex items-center gap-1.5 font-mono text-[11px] tracking-[0.08em] text-dim">
                    <LuTerminal className="size-3" />
                    CONSOLE
                </span>

                {lines.length > 0 && (
                    <button
                        onClick={onClear}
                        aria-label="Clear console"
                        className="rounded p-1 text-dim hover:bg-surface-raised hover:text-heading"
                    >
                        <LuTrash2 className="size-3.5" />
                    </button>
                )}
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-2">
                {lines.length === 0 ? (
                    <p className="m-0 font-mono text-[11px] text-dim">
                        Run a JavaScript file to see its output here.
                    </p>
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-0.5 p-0">
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
        </section>
    )
}
