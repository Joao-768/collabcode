import { io, type Socket } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? 'http://localhost:4000'

let socket: Socket | null = null

export function getSocket(): Socket {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            autoConnect: false,
        })
    }

    return socket
}

export function disconnectSocket(): void {
    socket?.disconnect()
    socket = null
}

export const SOCKET_EVENTS = {
    ROOM_JOIN: 'room:join',
    ROOM_LEAVE: 'room:leave',
    ROOM_ERROR: 'room:error',
    DOCUMENT_SYNC: 'document:sync',
    DOCUMENT_UPDATE: 'document:update',
    CURSOR_UPDATE: 'cursor:update',
    PRESENCE_UPDATE: 'presence:update',
    CHAT_MESSAGE: 'chat:message',
    FILE_CREATED: 'file:created',
    FILE_RENAMED: 'file:renamed',
    FILE_DELETED: 'file:deleted',
} as const
