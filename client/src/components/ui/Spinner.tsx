type SpinnerProps = {
    className?: string
}

export function Spinner({ className = 'size-4' }: SpinnerProps) {
    return (
        <span
            className={`inline-block animate-spin rounded-full border-2 border-border-strong border-t-cream ${className}`}
            aria-label="Loading"
        />
    )
}
