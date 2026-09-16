import { Wordmark } from '@/components/Wordmark'
import { useAuth } from '@/context/authContext'
import { LuLogOut } from 'react-icons/lu'

export function DashboardPage() {
    const { user } = useAuth()

    function handleLogout() {
        fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Logout failed')
                }
                window.location.href = '/login'
            })
            .catch((error) => {
                console.error(error)
            })
    }

    return (
        <div className="min-h-svh bg-canvas text-heading">
            <header className="border-b border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4.5">
                    <Wordmark />

                    <div className="flex items-center gap-5">
                        <span className="label hidden text-dim sm:inline">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="label flex items-center gap-2 text-muted transition-colors hover:text-cream"
                        >
                            <LuLogOut className="size-3.5" />
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-8 py-16">
                <h1 className="display m-0 text-[clamp(2.25rem,5vw,3.5rem)] text-heading">
                    Your projects
                </h1>
                <p className="mt-4 mb-10 max-w-md text-[15px] leading-[1.6] text-muted">
                    Create a room, share the link, and start coding together.
                </p>

                <div className="border-t border-border py-24 text-center">
                    <p className="m-0 font-serif text-2xl text-heading">No projects yet</p>
                    <p className="mt-2 m-0 text-sm text-muted">
                        Projects are not built yet. This page proves the session survives.
                    </p>
                </div>
            </main>
        </div>
    )
}
