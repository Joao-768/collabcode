import { Link } from 'react-router-dom'
import { LuArrowLeft } from 'react-icons/lu'
import { Wordmark } from '@/components/Wordmark'

export function NotFoundPage() {
    return (
        <div className="grid min-h-svh grid-rows-[auto_1fr] bg-canvas text-heading">
            <header className="px-8 py-6">
                <Wordmark />
            </header>

            <main className="grid place-items-center px-8 pb-24">
                <div className="max-w-md text-center">
                    <p className="label m-0 text-dim">Error 404</p>
                    <h1 className="display mt-5 mb-0 text-[clamp(2.5rem,6vw,4rem)] text-heading">
                        Page not found
                    </h1>
                    <p className="mt-4 mb-8 text-[15px] leading-[1.6] text-muted">
                        That room doesn't exist, or the link has expired.
                    </p>
                    <Link to="/" className="pill-outline">
                        <LuArrowLeft className="size-3.5" aria-hidden="true" />
                        Back to home
                    </Link>
                </div>
            </main>
        </div>
    )
}
