import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import type { Socket } from 'socket.io-client'
import {
    Awareness,
    applyAwarenessUpdate,
    encodeAwarenessUpdate,
    removeAwarenessStates,
} from 'y-protocols/awareness'

export type YSession = {
    doc: Y.Doc
    awareness: Awareness
}

/**
 * Holds one Y.Doc per open file, plus the awareness that carries cursors.
 *
 * The document is persisted; awareness is not. A cursor position only means
 * anything while its owner is connected, so it lives and dies with the socket
 * rather than being written anywhere.
 */
export function useYDoc(socket: Socket | null, fileId: string | null, initialText: string) {
    const [session, setSession] = useState<YSession | null>(null)

    useEffect(() => {
        if (!socket || !fileId) {
            setSession(null)
            return
        }

        const doc = new Y.Doc()
        const awareness = new Awareness(doc)

        // Seeding is the first client's job alone. Two clients each inserting
        // the stored text would be two independent sets of characters as far as
        // the CRDT is concerned, and it would faithfully keep both: the
        // document would read as the file twice over.
        let seeded = false

        function seedFromServer() {
            if (seeded) return
            seeded = true
            if (initialText) {
                doc.getText('content').insert(0, initialText)
            }
        }

        // Local edits produce updates to broadcast. The origin check keeps this
        // from echoing back updates that arrived from the socket, which would
        // bounce between clients forever.
        function handleLocalUpdate(update: Uint8Array, origin: unknown) {
            if (origin === 'remote') return
            socket!.emit('file:update', { fileId, update })
        }

        doc.on('update', handleLocalUpdate)

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
            Y.applyUpdate(doc, new Uint8Array(update), 'remote')
        }

        socket.on('file:update', handleRemoteUpdate)

        // Someone joined and asked for the current state. Answer with the whole
        // document, addressed to them alone.
        function handleSyncRequest({ fileId: wantedId, from }: { fileId: string; from: string }) {
            if (wantedId !== fileId) return
            socket!.emit('file:sync-response', {
                to: from,
                fileId,
                update: Y.encodeStateAsUpdate(doc),
            })
        }

        socket.on('file:sync-request', handleSyncRequest)

        // Awareness travels on its own channel: it is not part of the document
        // and must never be merged into it.
        let remoteAwareness = false

        function handleLocalAwareness({
            added,
            updated,
            removed,
        }: {
            added: number[]
            updated: number[]
            removed: number[]
        }) {
            if (remoteAwareness) return

            const changed = [...added, ...updated, ...removed]
            socket!.emit('awareness:update', {
                fileId,
                update: encodeAwarenessUpdate(awareness, changed),
            })
        }

        awareness.on('update', handleLocalAwareness)

        function handleRemoteAwareness({
            fileId: incomingId,
            update,
        }: {
            fileId: string
            update: ArrayBuffer
        }) {
            if (incomingId !== fileId) return

            // The guard stops an incoming state from being re-broadcast as if
            // it were this client's own.
            remoteAwareness = true
            applyAwarenessUpdate(awareness, new Uint8Array(update), 'remote')
            remoteAwareness = false
        }

        socket.on('awareness:update', handleRemoteAwareness)

        // Ask the room for its state, then seed from the server only if nobody
        // answers in time. Silence means this client is the first one here.
        socket.emit('file:sync-request', { fileId })
        const seedTimer = setTimeout(seedFromServer, 400)

        setSession({ doc, awareness })

        return () => {
            clearTimeout(seedTimer)
            doc.off('update', handleLocalUpdate)
            awareness.off('update', handleLocalAwareness)
            socket.off('file:update', handleRemoteUpdate)
            socket.off('file:sync-request', handleSyncRequest)
            socket.off('awareness:update', handleRemoteAwareness)

            // Tell the room this cursor is gone before tearing down, or it
            // would linger on everyone else's screen until they reload.
            removeAwarenessStates(awareness, [doc.clientID], 'unmount')
            awareness.destroy()
            doc.destroy()
        }
        // initialText is deliberately not a dependency: it seeds the document
        // once, and re-running on every keystroke would rebuild it constantly.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, fileId])

    return session
}
