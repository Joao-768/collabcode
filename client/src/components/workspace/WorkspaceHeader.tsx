import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LuCheck, LuLink, LuArrowLeft, LuPlay } from 'react-icons/lu'
import { PresenceBar } from '@/components/workspace/PresenceBar'
import type { PresenceUser } from '@/types'
import { copyText, shareableUrl } from '@/lib/share'

type WorkspaceHeaderProps = {
    projectName: string
    users: PresenceUser[]
    currentUserId: string | undefined
    canRun: boolean
    running: boolean
    onRun: () => void
}

export function WorkspaceHeader({
    projectName,
    users,
    currentUserId,
    canRun,
    running,
    onRun,
}: WorkspaceHeaderProps) {
    const [copied, setCopied] = useState(false)

    async function handleShare() {
        await copyText(shareableUrl())
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <header className="flex shrink-0 items-center justify-between gap-3 border-b border-border bg-canvas px-3 py-3 sm:gap-4 sm:px-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <Link
                    to="/dashboard"
                    aria-label="Back to dashboard"
                    className="rounded-md p-1.5 text-dim transition-colors hover:bg-surface hover:text-cream"
                >
                    <LuArrowLeft className="size-4" />
                </Link>
                <span className="truncate font-serif text-lg leading-none text-cream">
                    {projectName}
                </span>
            </div>

            <div className="flex shrink-0 items-center gap-3 sm:gap-4">
                <PresenceBar users={users} currentUserId={currentUserId} />

                <div className="flex items-center gap-2">
                    <button
                        onClick={onRun}
                        disabled={!canRun || running}
                        className="label flex items-center gap-2 rounded-full border border-border-strong px-3.5 py-2 text-muted transition-colors hover:border-cream/50 hover:text-cream disabled:opacity-35 disabled:hover:border-border-strong disabled:hover:text-muted"
                    >
                        <LuPlay className="size-3" />
                        {running ? 'Running…' : 'Run'}
                    </button>

                    <button
                        onClick={handleShare}
                        aria-label="Copy workspace link"
                        className="label flex items-center gap-2 rounded-full border border-border-strong px-3.5 py-2 text-muted transition-colors hover:border-cream/50 hover:text-cream"
                    >
                        {copied ? (
                            <LuCheck className="size-3 text-live" />
                        ) : (
                            <LuLink className="size-3" />
                        )}
                        <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
