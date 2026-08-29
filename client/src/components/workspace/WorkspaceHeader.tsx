import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LuCheck, LuLink, LuArrowLeft } from 'react-icons/lu'
import { PresenceBar } from '@/components/workspace/PresenceBar'
import type { PresenceUser } from '@/types'

type WorkspaceHeaderProps = {
    projectName: string
    users: PresenceUser[]
    currentUserId: string | undefined
}

export function WorkspaceHeader({ projectName, users, currentUserId }: WorkspaceHeaderProps) {
    const [copied, setCopied] = useState(false)

    async function handleShare() {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2.5">
            <div className="flex items-center gap-3">
                <Link
                    to="/dashboard"
                    aria-label="Back to dashboard"
                    className="rounded p-1 text-dim hover:bg-surface-raised hover:text-heading"
                >
                    <LuArrowLeft className="size-4" />
                </Link>
                <span className="text-sm font-medium text-heading">{projectName}</span>
            </div>

            <div className="flex items-center gap-5">
                <PresenceBar users={users} currentUserId={currentUserId} />

                <button
                    onClick={handleShare}
                    className="flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-xs text-muted hover:text-heading"
                >
                    {copied ? (
                        <LuCheck className="size-3.5 text-success" />
                    ) : (
                        <LuLink className="size-3.5" />
                    )}
                    {copied ? 'Copied' : 'Share'}
                </button>
            </div>
        </header>
    )
}
