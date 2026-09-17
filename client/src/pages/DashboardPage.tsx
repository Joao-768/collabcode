import { Spinner } from '@/components/ui/Spinner'
import { Wordmark } from '@/components/Wordmark'
import { useAuth } from '@/context/authContext'
import { useEffect, useState } from 'react'
import { LuLogOut } from 'react-icons/lu'

type Project = {
    id: string
    name: string
    ownerId: string
    created_at: string
    _count?: { members: number }
}

export function DashboardPage() {
    const { user } = useAuth()
    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/projects`, {
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch projects')
                }
                return response.json()
            })
            .then((data) => {
                setProjects(data.projects)
                setLoading(false)
            })
            .catch((err) => {
                setError(err.message)
                setLoading(false)
            })
    }, [])

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

                {loading ? (
                    <div className="grid place-items-center py-24">
                        <Spinner className="size-6" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="border-t border-border py-24 text-center">
                        <p className="m-0 font-serif text-2xl text-heading">No projects yet</p>
                        <p className="mt-2 m-0 text-sm text-muted">
                            Projects are not built yet. This page proves the session survives.
                        </p>
                    </div>
                ) : (
                    <ul className="m-0 grid list-none grid-cols-1 gap-px border-y border-border bg-border p-0">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="group flex items-center justify-between gap-4 bg-canvas px-4 py-5 transition-colors hover:bg-surface"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="m-0 truncate font-serif text-xl text-heading">
                                        {project.name}
                                    </p>
                                    <p className="mt-1.5 m-0 font-mono text-[11.5px] text-dim">
                                        {project._count?.members ?? 1} members
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                {error && (
                    <div className="mt-6 rounded-lg bg-red-100 p-4 text-sm text-red-700">
                        {error}
                    </div>
                )}
            </main>
        </div>
    )
}
