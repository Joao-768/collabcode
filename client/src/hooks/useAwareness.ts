import { useEffect, useState } from 'react'
import * as Y from 'yjs'
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness'
import type { Socket } from 'socket.io-client'
import { SOCKET_EVENTS } from '@/services/socket'
import type { User } from '@/types'

// oxlint-disable react/set-state-in-effect -- these hooks exist to synchronise
// React with external systems (a socket connection and Yjs documents). The
// instances are created in the effect and must be published to render, which
// is the case this rule is designed to allow.

const REMOTE_ORIGIN = 'remote'

/**
 * Wraps a Yjs Awareness instance and ships its updates over the existing
 * socket as cursor:update events, so cursors and selections travel on the
 * same connection as the document.
 */
export function useAwareness(
    socket: Socket | null,
    doc: Y.Doc | null,
    fileId: string | null,
    user: User | undefined,
    color: string | undefined,
) {
    const [awareness, setAwareness] = useState<Awareness | null>(null)

    // Recreated only when the document itself changes. The user's colour is
    // applied separately below, so a late presence update does not tear down
    // the instance the MonacoBinding is already bound to.
    useEffect(() => {
        if (!socket || !doc || !fileId) {
            setAwareness(null)
            return
        }

        const instance = new Awareness(doc)

        function handleLocalUpdate(
            { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
            origin: unknown,
        ) {
            if (origin === REMOTE_ORIGIN) return

            socket!.emit(SOCKET_EVENTS.CURSOR_UPDATE, {
                fileId,
                cursor: encodeAwarenessUpdate(instance, [...added, ...updated, ...removed]),
            })
        }

        function handleRemote({ fileId: id, cursor }: { fileId: string; cursor: ArrayBuffer }) {
            if (id !== fileId) return
            applyAwarenessUpdate(instance, new Uint8Array(cursor), REMOTE_ORIGIN)
        }

        // Awareness only sends on change, so someone who opens the file while
        // we sit still would not see our cursor. Greet each newcomer with it.
        function handleChange({ added }: { added: number[] }, origin: unknown) {
            if (origin !== REMOTE_ORIGIN || added.length === 0) return
            if (!instance.getLocalState()) return

            socket!.emit(SOCKET_EVENTS.CURSOR_UPDATE, {
                fileId,
                cursor: encodeAwarenessUpdate(instance, [instance.clientID]),
            })
        }

        // Closing the tab skips React's cleanup, and without this the others
        // would keep seeing our cursor until awareness times it out (30s).
        function handlePageHide() {
            instance.setLocalState(null)
        }

        instance.on('update', handleLocalUpdate)
        instance.on('change', handleChange)
        socket.on(SOCKET_EVENTS.CURSOR_UPDATE, handleRemote)
        window.addEventListener('pagehide', handlePageHide)

        setAwareness(instance)

        return () => {
            // Tell the others our cursor is gone before we stop sending.
            instance.setLocalState(null)
            instance.off('update', handleLocalUpdate)
            instance.off('change', handleChange)
            window.removeEventListener('pagehide', handlePageHide)
            socket.off(SOCKET_EVENTS.CURSOR_UPDATE, handleRemote)
            instance.destroy()
            setAwareness(null)
        }
    }, [socket, doc, fileId])

    // Identity is a field on the existing instance, not a reason to rebuild it.
    useEffect(() => {
        if (!awareness || !user) return

        awareness.setLocalStateField('user', {
            name: user.name,
            color: color ?? '#2563eb',
        })
    }, [awareness, user, color])

    return awareness
}
