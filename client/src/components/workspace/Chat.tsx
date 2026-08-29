import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { LuSend } from 'react-icons/lu'
import { Spinner } from '@/components/ui/Spinner'
import type { ChatMessage } from '@/types'

type ChatProps = {
    messages: ChatMessage[]
    loading: boolean
    currentUserId: string | undefined
    onSend: (content: string) => void
}

function formatTime(iso: string): string {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function Chat({ messages, loading, currentUserId, onSend }: ChatProps) {
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
        <aside className="flex h-full w-64 flex-col border-l border-border bg-surface">
            <div className="border-b border-border px-3 py-2.5">
                <span className="font-mono text-[11px] tracking-[0.08em] text-dim">CHAT</span>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
                {loading ? (
                    <div className="grid place-items-center py-6">
                        <Spinner className="size-4" />
                    </div>
                ) : messages.length === 0 ? (
                    <p className="m-0 py-6 text-center font-mono text-[11px] text-dim">
                        No messages yet
                    </p>
                ) : (
                    <ul className="m-0 flex list-none flex-col gap-3 p-0">
                        {messages.map((message) => (
                            <li key={message.id}>
                                <div className="flex items-baseline gap-2">
                                    <span
                                        className={`text-xs font-medium ${
                                            message.user.id === currentUserId
                                                ? 'text-accent'
                                                : 'text-heading'
                                        }`}
                                    >
                                        {message.user.name}
                                    </span>
                                    <span className="font-mono text-[10px] text-dim">
                                        {formatTime(message.createdAt)}
                                    </span>
                                </div>
                                <p className="mt-0.5 mb-0 text-[13px] leading-snug wrap-break-word text-muted">
                                    {message.content}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
                <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex gap-1.5 border-t border-border p-2.5">
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Message…"
                    maxLength={2000}
                    className="min-w-0 flex-1 rounded border border-border-strong bg-canvas px-2.5 py-1.5 text-xs text-heading outline-none placeholder:text-dim focus:border-accent"
                />
                <button
                    type="submit"
                    disabled={!draft.trim()}
                    aria-label="Send message"
                    className="rounded border border-border-strong px-2 text-dim hover:text-heading disabled:opacity-40"
                >
                    <LuSend className="size-3.5" />
                </button>
            </form>
        </aside>
    )
}
