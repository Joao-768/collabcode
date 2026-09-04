import { Link } from 'react-router-dom'

type WordmarkProps = {
    /** Onde o wordmark navega. `null` renderiza sem link (util em headers de app). */
    to?: string | null
    className?: string
}

/** Marca do CollabCode: um glifo geometrico em creme + o nome em serif.
 *  Vivia duplicado em cinco ficheiros -- agora e um so. */
export function Wordmark({ to = '/', className = '' }: WordmarkProps) {
    const content = (
        <span className={`flex items-center gap-2.5 ${className}`}>
            <Glyph />
            <span className="font-serif text-[19px] leading-none tracking-[-0.01em] text-cream">
                CollabCode
            </span>
        </span>
    )

    if (to === null) return content

    return (
        <Link to={to} className="shrink-0">
            {content}
        </Link>
    )
}

/** Dois blocos sobrepostos: duas pessoas no mesmo ficheiro. */
function Glyph() {
    return (
        <svg
            viewBox="0 0 24 24"
            className="size-6 shrink-0 text-cream"
            fill="none"
            aria-hidden="true"
        >
            <rect x="2.5" y="6" width="12" height="12" rx="2.5" stroke="currentColor" />
            <rect
                x="9.5"
                y="6"
                width="12"
                height="12"
                rx="2.5"
                stroke="currentColor"
                opacity="0.45"
            />
        </svg>
    )
}
