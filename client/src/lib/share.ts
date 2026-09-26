// A link copied from http://localhost only works on this computer. In
// development Vite provides the machine's network address, so the link is
// rewritten to that and opens on a phone or another laptop on the same Wi-Fi.
export function shareableUrl(): string {
    const url = new URL(window.location.href)
    const lanHost: string | undefined = import.meta.env.VITE_LAN_HOST

    if (lanHost && ['localhost', '127.0.0.1'].includes(url.hostname)) {
        url.hostname = lanHost
    }

    return url.toString()
}

// navigator.clipboard only exists on https and localhost, so a phone opening
// the dev server by IP falls back to the older copy command.
export async function copyText(text: string): Promise<void> {
    if (navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        return
    }

    const field = document.createElement('textarea')
    field.value = text
    field.setAttribute('readonly', '')
    field.style.position = 'fixed'
    field.style.opacity = '0'
    document.body.appendChild(field)
    field.select()
    document.execCommand('copy')
    field.remove()
}
