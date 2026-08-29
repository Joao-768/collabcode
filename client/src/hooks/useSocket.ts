import { useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { getSocket, SOCKET_EVENTS } from '@/services/socket'

// oxlint-disable react/set-state-in-effect -- these hooks exist to synchronise
// React with external systems (a socket connection and Yjs documents). The
// instances are created in the effect and must be published to render, which
// is the case this rule is designed to allow.

export function useSocket(projectId: string | undefined) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const [connected, setConnected] = useState(false)
    const [socketError, setSocketError] = useState<string | null>(null)

    useEffect(() => {
        if (!projectId) return

        const instance = getSocket()

        function handleConnect() {
            instance.emit(SOCKET_EVENTS.ROOM_JOIN, { projectId })
            setConnected(true)
            setSocketError(null)
        }

        function handleDisconnect() {
            setConnected(false)
        }

        function handleRoomError({ error }: { error: string }) {
            setSocketError(error)
        }

        function handleConnectError() {
            setSocketError('Lost connection to the server. Retrying…')
        }

        instance.on('connect', handleConnect)
        instance.on('disconnect', handleDisconnect)
        instance.on(SOCKET_EVENTS.ROOM_ERROR, handleRoomError)
        instance.on('connect_error', handleConnectError)

        if (instance.connected) {
            handleConnect()
        } else {
            instance.connect()
        }

        setSocket(instance)

        return () => {
            instance.off('connect', handleConnect)
            instance.off('disconnect', handleDisconnect)
            instance.off(SOCKET_EVENTS.ROOM_ERROR, handleRoomError)
            instance.off('connect_error', handleConnectError)
        }
    }, [projectId])

    return { socket, connected, socketError }
}
