import { useEffect } from 'react'
import type { Awareness } from 'y-protocols/awareness'

/**
 * Paints remote cursors.
 *
 * y-monaco tags each remote selection with the peer's Yjs clientID
 * (`yRemoteSelection-123456`) and stops there: it writes no colours, so without
 * this the decorations exist and are invisible. One rule per connected peer is
 * written into a single stylesheet and rewritten whenever the room changes.
 */
export function useCursorStyles(awareness: Awareness | null) {
    useEffect(() => {
        if (!awareness) return

        const style = document.createElement('style')
        document.head.appendChild(style)

        function render() {
            const rules: string[] = []

            awareness!.getStates().forEach((state, clientID) => {
                if (clientID === awareness!.clientID) return

                const color = (state as { user?: { color?: string } }).user?.color
                if (!color) return

                rules.push(
                    `.yRemoteSelection-${clientID} { background-color: ${color}; }`,
                    `.yRemoteSelectionHead-${clientID} { border-left-color: ${color}; }`,
                )
            })

            style.textContent = rules.join('\n')
        }

        render()
        awareness.on('change', render)

        return () => {
            awareness.off('change', render)
            style.remove()
        }
    }, [awareness])
}
