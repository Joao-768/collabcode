import { textOn } from '@/lib/color'
import type { PresenceUser } from '@/types'

type PresenceBarProps = {
    users: PresenceUser[]
    currentUserId: string | undefined
}

function initials(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?'
}

/** Overlapping avatars and a count. Colours come from presence (one per
 *  person), so they stay vivid in both themes; the initial picks black or
 *  white for contrast. */
export function PresenceBar({ users, currentUserId }: PresenceBarProps) {
    if (users.length === 0) return null

    return (
        <div className="flex items-center gap-2.5">
            <div className="flex">
                {users.slice(0, 5).map((user, i) => (
                    <span
                        key={user.userId}
                        title={user.userId === currentUserId ? `${user.name} (you)` : user.name}
                        className={`flex size-6 items-center justify-center rounded-full border-2 border-canvas font-mono text-[10px] font-medium ${
                            i > 0 ? '-ml-2' : ''
                        }`}
                        style={{ background: user.color, color: textOn(user.color) }}
                    >
                        {initials(user.name)}
                    </span>
                ))}
            </div>

            <span className="label hidden text-dim lg:inline">{users.length} online</span>
        </div>
    )
}
