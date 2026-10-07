const HEX_COLOR = /^#[0-9a-f]{6}$/i

function channel(value: number): number {
    const c = value / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** Near-black or white, whichever reads better on a presence colour. The
 *  palette mixes light (amber, lime) and deep (blue, violet) hues, so one
 *  fixed text colour cannot work for all of them. */
export function textOn(background: string): string {
    if (!HEX_COLOR.test(background)) return '#0a0a0a'
    const r = channel(Number.parseInt(background.slice(1, 3), 16))
    const g = channel(Number.parseInt(background.slice(3, 5), 16))
    const b = channel(Number.parseInt(background.slice(5, 7), 16))
    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
    // Contrast with black is (L + 0.05) / 0.05, with white 1.05 / (L + 0.05).
    return (luminance + 0.05) / 0.05 >= 1.05 / (luminance + 0.05) ? '#0a0a0a' : '#ffffff'
}
