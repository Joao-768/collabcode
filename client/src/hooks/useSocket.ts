import { useEffect, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

/**
 * Opens one socket for a project and joins its room.
 *
 * The connection is tied to the component's lifetime: the cleanup closes it,
 * so leaving the workspace drops the socket and everyone else sees the
 * departure. Without that, navigating between projects would leave sockets
 * open and the user would appear present in rooms they had left.
 */
export function useSocket(projectId: string | undefined) {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
        if (!projectId) return

        // withCredentials sends the session cookie with the handshake, which is
        // what the server authenticates the connection with.
        const next = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true,
        })

        next.on('connect', () => {
            next.emit('project:join', { projectId })
        })

        setSocket(next)

        return () => {
            next.disconnect()
        }
    }, [projectId])

    return socket
}
