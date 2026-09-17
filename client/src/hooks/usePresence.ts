import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'

export type PresentUser = {
    id: string
    name: string
}

/** Tracks who is in the room, from the server's presence events. */
export function usePresence(socket: Socket | null) {
    const [users, setUsers] = useState<PresentUser[]>([])

    useEffect(() => {
        if (!socket) return

        function handleList({ users }: { users: PresentUser[] }) {
            setUsers(users)
        }

        function handleJoined({ user }: { user: PresentUser }) {
            // A second tab from the same person is a second socket but the same
            // user, so joins are deduplicated by id.
            setUsers((current) =>
                current.some((u) => u.id === user.id) ? current : [...current, user],
            )
        }

        function handleLeft({ user }: { user: PresentUser }) {
            setUsers((current) => current.filter((u) => u.id !== user.id))
        }

        socket.on('presence:list', handleList)
        socket.on('presence:joined', handleJoined)
        socket.on('presence:left', handleLeft)

        // Listeners are removed when the effect re-runs or the component
        // unmounts. Without this, a re-render would stack duplicate handlers
        // and every event would be processed more than once.
        return () => {
            socket.off('presence:list', handleList)
            socket.off('presence:joined', handleJoined)
            socket.off('presence:left', handleLeft)
        }
    }, [socket])

    return users
}
