import { useCallback, useEffect, useState } from 'react'
import type { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/services/socket'
import * as messageService from '@/services/message.service'
import type { ChatMessage } from '@/types'

export function useChat(socket: Socket | null, projectId: string | undefined) {
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!projectId) return
        let active = true

        messageService
            .listMessages(projectId)
            .then(({ messages }) => {
                if (active) setMessages(messages)
            })
            .catch(() => {
                if (active) setMessages([])
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [projectId])

    useEffect(() => {
        if (!socket) return

        function handleMessage({ message }: { message: ChatMessage }) {
            setMessages((current) =>
                current.some((m) => m.id === message.id) ? current : [...current, message],
            )
        }

        socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage)

        return () => {
            socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleMessage)
        }
    }, [socket])

    const send = useCallback(
        (content: string) => {
            const trimmed = content.trim()
            if (!socket || !trimmed) return

            socket.emit(SOCKET_EVENTS.CHAT_MESSAGE, { content: trimmed })
        },
        [socket],
    )

    return { messages, loading, send }
}
