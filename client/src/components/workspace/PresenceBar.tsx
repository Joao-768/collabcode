import type { PresenceUser } from '@/types'

type PresenceBarProps = {
    users: PresenceUser[]
    currentUserId: string | undefined
}

export function PresenceBar({ users, currentUserId }: PresenceBarProps) {
    if (users.length === 0) return null

    return (
        <div className="flex items-center gap-3">
            {users.map((user) => (
                <span key={user.userId} className="flex items-center gap-1.5" title={user.name}>
                    <span
                        className="size-1.5 rounded-full"
                        style={{ backgroundColor: user.color }}
                        aria-hidden="true"
                    />
                    <span className="text-xs text-muted">
                        {user.name}
                        {user.userId === currentUserId && ' (you)'}
                    </span>
                </span>
            ))}
        </div>
    )
}
