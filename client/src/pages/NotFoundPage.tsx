import { Link } from 'react-router-dom'

export function NotFoundPage() {
    return (
        <div className="grid min-h-svh place-items-center bg-canvas p-6 text-center text-heading">
            <div>
                <p className="font-mono text-sm text-muted">404</p>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
                    Page not found
                </h1>
                <Link to="/" className="mt-6 inline-block text-sm text-accent hover:text-accent/90">
                    Back to home
                </Link>
            </div>
        </div>
    )
}
