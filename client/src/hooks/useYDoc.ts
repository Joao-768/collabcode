import { useEffect, useRef, useState } from 'react'
import * as Y from 'yjs'
import type { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/services/socket'

// oxlint-disable react/set-state-in-effect -- these hooks exist to synchronise
// React with external systems (a socket connection and Yjs documents). The
// instances are created in the effect and must be published to render, which
// is the case this rule is designed to allow.

const REMOTE_ORIGIN = 'remote'

export function useYDoc(socket: Socket | null, fileId: string | null) {
    const [doc, setDoc] = useState<Y.Doc | null>(null)
    const [synced, setSynced] = useState(false)
    const docsRef = useRef<Map<string, Y.Doc>>(new Map())

    useEffect(() => {
        if (!socket || !fileId) {
            setDoc(null)
            setSynced(false)
            return
        }

        let currentDoc = docsRef.current.get(fileId)

        if (!currentDoc) {
            currentDoc = new Y.Doc()
            docsRef.current.set(fileId, currentDoc)
        }

        const activeDoc = currentDoc
        setDoc(activeDoc)
        setSynced(false)

        function handleSync({ fileId: id, update }: { fileId: string; update: ArrayBuffer }) {
            if (id !== fileId) return
            Y.applyUpdate(activeDoc, new Uint8Array(update), REMOTE_ORIGIN)
            setSynced(true)
        }

        function handleUpdate({ fileId: id, update }: { fileId: string; update: ArrayBuffer }) {
            if (id !== fileId) return
            Y.applyUpdate(activeDoc, new Uint8Array(update), REMOTE_ORIGIN)
        }

        function handleLocalUpdate(update: Uint8Array, origin: unknown) {
            if (origin === REMOTE_ORIGIN) return
            socket!.emit(SOCKET_EVENTS.DOCUMENT_UPDATE, { fileId, update })
        }

        socket.on(SOCKET_EVENTS.DOCUMENT_SYNC, handleSync)
        socket.on(SOCKET_EVENTS.DOCUMENT_UPDATE, handleUpdate)
        activeDoc.on('update', handleLocalUpdate)

        socket.emit(SOCKET_EVENTS.DOCUMENT_SYNC, { fileId })

        return () => {
            socket.off(SOCKET_EVENTS.DOCUMENT_SYNC, handleSync)
            socket.off(SOCKET_EVENTS.DOCUMENT_UPDATE, handleUpdate)
            activeDoc.off('update', handleLocalUpdate)
        }
    }, [socket, fileId])

    return { doc, synced }
}
