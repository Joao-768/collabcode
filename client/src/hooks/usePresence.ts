import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/services/socket'
import type { PresenceUser } from '@/types'

export function usePresence(socket: Socket | null) {
    const [users, setUsers] = useState<PresenceUser[]>([])

    useEffect(() => {
        if (!socket) return

        function handlePresence({ users }: { users: PresenceUser[] }) {
            setUsers(users)
        }

        socket.on(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresence)

        return () => {
            socket.off(SOCKET_EVENTS.PRESENCE_UPDATE, handlePresence)
        }
    }, [socket])

    return users
}
