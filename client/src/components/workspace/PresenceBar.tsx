import type { PresentUser } from '@/hooks/usePresence'

type PresenceBarProps = {
    users: PresentUser[]
    currentUserId: string | undefined
}

/** A stable colour per user, derived from the id so every client agrees. */
const COLORS = ['#f472b6', '#7ee787', '#fbbf24', '#60a5fa', '#c084fc', '#fb923c']

function colorFor(id: string): string {
    let hash = 0
    for (const char of id) {
        hash = (hash * 31 + char.charCodeAt(0)) | 0
    }
    return COLORS[Math.abs(hash) % COLORS.length]
}

/** Overlapping avatars plus a count. */
export function PresenceBar({ users, currentUserId }: PresenceBarProps) {
    if (users.length === 0) return null

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex">
                {users.slice(0, 5).map((user, i) => (
                    <span
                        key={user.id}
                        title={user.id === currentUserId ? `${user.name} (you)` : user.name}
                        className={`flex size-6 items-center justify-center rounded-full border-2 border-canvas font-mono text-[10px] font-medium ${
                            i > 0 ? '-ml-2' : ''
                        }`}
                        style={{ background: colorFor(user.id), color: '#0a0a0a' }}
                    >
                        {user.name.trim().charAt(0).toUpperCase() || '?'}
                    </span>
                ))}
            </div>

            <span className="label hidden text-dim lg:inline">{users.length} online</span>
        </div>
    )
}
