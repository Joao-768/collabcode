import type { PresenceUser } from '@/types'

type PresenceBarProps = {
    users: PresenceUser[]
    currentUserId: string | undefined
}

function initials(name: string): string {
    return name.trim().charAt(0).toUpperCase() || '?'
}

/** Avatares sobrepostos + contagem. As cores vem da presenca (uma por
 *  utilizador), por isso continuam vivas mesmo com a paleta creme. */
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
                        style={{ background: user.color, color: '#0a0a0a' }}
                    >
                        {initials(user.name)}
                    </span>
                ))}
            </div>

            <span className="label hidden text-dim lg:inline">{users.length} online</span>
        </div>
    )
}
