import type { Awareness } from 'y-protocols/awareness'
import { textOn } from '@/lib/color'

type RemoteUser = { name?: unknown; color?: unknown }

const HEX_COLOR = /^#[0-9a-f]{6}$/i
const FALLBACK_COLOR = '#2563eb'

// Names end up inside a CSS string, so anything that could close it is dropped.
function cssString(value: string): string {
    return `"${value.replace(/["\\\n\r<>]/g, '').slice(0, 40)}"`
}

function rulesFor(clientId: number, user: RemoteUser): string {
    const color =
        typeof user.color === 'string' && HEX_COLOR.test(user.color) ? user.color : FALLBACK_COLOR
    const name = typeof user.name === 'string' ? user.name : 'Guest'

    return `
.yRemoteSelection-${clientId} {
    background-color: ${color}40;
}
.yRemoteSelectionHead-${clientId} {
    position: absolute;
    box-sizing: border-box;
    height: 100%;
    border-left: 2px solid ${color};
}
.yRemoteSelectionHead-${clientId}::after {
    content: ${cssString(name)};
    position: absolute;
    top: -1.45em;
    left: -2px;
    z-index: 10;
    padding: 0 5px;
    border-radius: 3px 3px 3px 0;
    background: ${color};
    color: ${textOn(color)};
    font: 500 10px/1.6 'Geist Mono', ui-monospace, monospace;
    white-space: nowrap;
    pointer-events: none;
}`
}

/**
 * y-monaco only tags other people's cursors and selections with
 * `yRemoteSelection-<clientID>` classes and leaves the styling to the app.
 * This keeps a style sheet in step with the awareness states, giving each
 * person their presence colour and a name tag on their cursor.
 */
export function styleRemoteCursors(awareness: Awareness): () => void {
    const sheet = document.createElement('style')
    document.head.appendChild(sheet)

    function render() {
        let css = ''

        awareness.getStates().forEach((state, clientId) => {
            if (clientId === awareness.clientID || !state.user) return
            css += rulesFor(clientId, state.user as RemoteUser)
        })

        sheet.textContent = css
    }

    render()
    awareness.on('change', render)

    return () => {
        awareness.off('change', render)
        sheet.remove()
    }
}
