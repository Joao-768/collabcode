import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { LuArrowUp, LuChevronRight } from 'react-icons/lu'
import { Spinner } from '@/components/ui/Spinner'
import type { ChatMessage } from '@/types'

type ChatProps = {
    messages: ChatMessage[]
    loading: boolean
    currentUserId: string | undefined
    onSend: (content: string) => void
    onCollapse: () => void
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Chat({ messages, loading, currentUserId, onSend, onCollapse }: ChatProps) {
    const [draft, setDraft] = useState('')
    const bottomRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ block: 'end' })
    }, [messages])

    function handleSubmit(event: FormEvent) {
        event.preventDefault()
        if (!draft.trim()) return

        onSend(draft)
        setDraft('')
    }

    return (
        <aside className="flex h-full w-68 flex-col border-l border-border bg-canvas">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="label text-dim">Chat</span>
                <button
                    onClick={onCollapse}
                    aria-label="Hide chat"
                    className="rounded-md p-1 text-dim transition-colors hover:bg-surface hover:text-cream"
                >
                    <LuChevronRight className="size-3.5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4">
                {loading ? (
                    <div className="grid place-items-center py-8">
                        <Spinner className="size-4" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="m-0 py-8 text-center font-mono text-[11px] text-faint">
                        No messages yet
                    </p>
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-4 p-0">
                        {messages.map((message) => (
                            <li key={message.id}>
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className={`text-xs font-medium ${
                                            message.user.id === currentUserId
                                                ? 'text-cream'
                                                : 'text-heading'
                                        }`}
                                    >
                                        {message.user.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-faint">
                                        {formatTime(message.createdAt)}
                                    </span>
                                </div>
                                <p className="mt-1 mb-0 text-[13px] leading-relaxed wrap-break-word text-muted">
                                    {message.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border p-3">
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Message…"
                    maxLength={2000}
                    className="min-w-0 flex-1 rounded-full border border-border-strong bg-surface px-3.5 py-2 text-xs text-heading outline-none transition-colors placeholder:text-faint focus:border-cream/50"
                />
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="grid size-8 shrink-0 place-items-center rounded-full bg-cream text-canvas transition-colors hover:bg-solid-hover disabled:bg-cream/40 disabled:text-canvas/60 disabled:hover:bg-cream/40"
                >
                    <LuArrowUp className="size-3.5" />
                </button>
            </form>
        </aside>
    )
}
