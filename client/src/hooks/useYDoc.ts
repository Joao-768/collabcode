import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import type { Socket } from 'socket.io-client'

/**
 * Holds one Y.Doc per open file and keeps it in step with the room.
 *
 * The document, not React state, is the source of truth for the text. React
 * only re-renders when the document says it changed.
 */
export function useYDoc(socket: Socket | null, fileId: string | null, initialText: string) {
    const [doc, setDoc] = useState<Y.Doc | null>(null)

    useEffect(() => {
        if (!socket || !fileId) {
            setDoc(null)
            return
        }

        const next = new Y.Doc()

        // Seeding is the first client's job alone. Two clients each inserting
        // the stored text would be two independent sets of characters as far as
        // the CRDT is concerned, and it would faithfully keep both: the
        // document would read as the file twice over.
        let seeded = false

        function seedFromServer() {
            if (seeded) return
            seeded = true
            if (initialText) {
                next.getText('content').insert(0, initialText)
            }
        }

        // Local edits produce updates to broadcast. The origin check keeps this
        // from echoing back updates that arrived from the socket, which would
        // bounce between clients forever.
        function handleLocalUpdate(update: Uint8Array, origin: unknown) {
            if (origin === 'remote') return
            socket!.emit('file:update', { fileId, update })
        }

        next.on('update', handleLocalUpdate)

        // Remote updates are merged, not assigned. Merging is what makes the
        // order of arrival irrelevant.
        function handleRemoteUpdate({
            fileId: incomingId,
            update,
        }: {
            fileId: string
            update: ArrayBuffer
        }) {
            if (incomingId !== fileId) return

            // An answer arrived, so someone else already holds this document
            // and there is nothing to seed.
            seeded = true
            Y.applyUpdate(next, new Uint8Array(update), 'remote')
        }

        socket.on('file:update', handleRemoteUpdate)

        // Someone joined and asked for the current state. Answer with the whole
        // document, addressed to them alone.
        function handleSyncRequest({ fileId: wantedId, from }: { fileId: string; from: string }) {
            if (wantedId !== fileId) return
            socket!.emit('file:sync-response', {
                to: from,
                fileId,
                update: Y.encodeStateAsUpdate(next),
            })
        }

        socket.on('file:sync-request', handleSyncRequest)

        // Ask the room for its state, then seed from the server only if nobody
        // answers in time. Silence means this client is the first one here.
        socket.emit('file:sync-request', { fileId })
        const seedTimer = setTimeout(seedFromServer, 400)

        setDoc(next)

        return () => {
            clearTimeout(seedTimer)
            next.off('update', handleLocalUpdate)
            socket.off('file:update', handleRemoteUpdate)
            socket.off('file:sync-request', handleSyncRequest)
            next.destroy()
        }
        // initialText is deliberately not a dependency: it seeds the document
        // once, and re-running on every keystroke would rebuild it constantly.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, fileId])

    return doc
}
