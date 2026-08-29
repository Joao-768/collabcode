import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket, SOCKET_EVENTS } from '@/services/socket'

export function useSocket(projectId: string | undefined) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)

    useEffect(() => {
        if (!projectId) return

        const instance = getSocket()

        function handleConnect() {
            instance.emit(SOCKET_EVENTS.ROOM_JOIN, { projectId })
            setConnected(true)
        }

        function handleDisconnect() {
            setConnected(false)
        }

        instance.on('connect', handleConnect)
        instance.on('disconnect', handleDisconnect)

        if (instance.connected) {
            handleConnect()
        } else {
            instance.connect()
        }

        setSocket(instance)

        return () => {
            instance.off('connect', handleConnect)
            instance.off('disconnect', handleDisconnect)
        }
    }, [projectId])

    return { socket, connected }
}
