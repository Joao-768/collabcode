import { LuTrash2 } from 'react-icons/lu'
import type { ConsoleLine } from '@/lib/runner'

type ConsoleProps = {
    lines: ConsoleLine[]
    onClear: () => void
    input: string
    onInputChange: (value: string) => void
}

const LEVEL_CLASS: Record<ConsoleLine['level'], string> = {
    log: 'text-muted',
    info: 'text-muted',
    warn: 'text-amber-400',
    error: 'text-red-400',
    system: 'text-faint',
}

export function Console({ lines, onClear, input, onInputChange }: ConsoleProps) {
    return (
        <section className="flex h-56 shrink-0 flex-col border-t border-border bg-canvas">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="label text-dim">Console</span>

                {lines.length > 0 && (
                    <button
                        onClick={onClear}
                        aria-label="Clear console"
                        className="rounded-md p-1 text-faint transition-colors hover:bg-surface hover:text-cream"
                    >
                        <LuTrash2 className="size-3.5" />
                    </button>
                )}
            </div>

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
        </section>
    )
}
