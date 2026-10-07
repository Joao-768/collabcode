import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuPlus, LuTrash2, LuArrowUpRight, LuLogOut } from 'react-icons/lu'
import { useAuthStore } from '@/stores/auth.store'
import * as projectService from '@/services/project.service'
import { ApiError } from '@/services/api'
import { Spinner } from '@/components/ui/Spinner'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Wordmark } from '@/components/Wordmark'
import type { Project } from '@/types'

function plural(count: number, noun: string): string {
    return `${count} ${noun}${count === 1 ? '' : 's'}`
}

export function DashboardPage() {
    const navigate = useNavigate()
    const user = useAuthStore((s) => s.user)
    const signOut = useAuthStore((s) => s.signOut)

    const [projects, setProjects] = useState<Project[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [name, setName] = useState('')
    const [creating, setCreating] = useState(false)

    useEffect(() => {
        let active = true

        projectService
            .listProjects()
            .then(({ projects }) => {
                if (active) {
                    setProjects(projects)
                    setError(null)
                }
            })
            .catch((err: unknown) => {
                if (active) {
                    setError(err instanceof ApiError ? err.message : 'Could not load projects')
                }
            })
            .finally(() => {
                if (active) setLoading(false)
            })

        return () => {
            active = false
        }
    }, [])

    async function handleCreate(event: FormEvent) {
        event.preventDefault()
        if (!name.trim()) return

        setCreating(true)
        setError(null)

        try {
            const { project } = await projectService.createProject(name.trim())
            void navigate(`/workspace/${project.id}`)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not create project')
            setCreating(false)
        }
    }

    async function handleDelete(id: string) {
        const previous = projects
        setProjects((list) => list.filter((p) => p.id !== id))

        try {
            await projectService.deleteProject(id)
        } catch (err) {
            setProjects(previous)
            setError(err instanceof ApiError ? err.message : 'Could not delete project')
        }
    }

    async function handleSignOut() {
        await signOut()
        void navigate('/login')
    }

    return (
        <div className="min-h-svh bg-canvas text-heading">
            <header className="border-b border-border">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-8 py-4.5">
                    <Wordmark />

                    <div className="flex items-center gap-5">
                        <span className="label hidden text-dim sm:inline">{user?.name}</span>
                        <ThemeToggle />
                        <button
                            onClick={handleSignOut}
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

                <form onSubmit={handleCreate} className="mb-10 flex flex-wrap gap-3">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New project name"
                        maxLength={80}
                        className="field min-w-60 flex-1"
                    />
                    <button
                        type="submit"
                        disabled={creating || !name.trim()}
                        className="pill-solid"
                    >
                        {creating ? (
                            <Spinner className="size-3.5 border-canvas/30 border-t-canvas" />
                        ) : (
                            <LuPlus className="size-3.5" />
                        )}
                        Create
                    </button>
                </form>

                {error && (
                    <p className="mb-6 rounded-lg border border-danger-border bg-danger-bg px-3.5 py-2.5 text-sm text-danger">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="grid place-items-center py-24">
                        <Spinner className="size-6" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="border-t border-border py-24 text-center">
                        <p className="m-0 font-serif text-2xl text-heading">No projects yet</p>
                        <p className="mt-2 m-0 text-sm text-muted">
                            Create your first room using the field above.
                        </p>
                    </div>
                ) : (
                    <ul className="m-0 grid list-none grid-cols-1 gap-px border-y border-border bg-border p-0">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="group flex items-center justify-between gap-4 bg-canvas px-1 py-5 transition-colors hover:bg-surface"
                            >
                                <Link
                                    to={`/workspace/${project.id}`}
                                    className="flex min-w-0 flex-1 items-center gap-4 px-4"
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="m-0 truncate font-serif text-xl text-heading">
                                            {project.name}
                                        </p>
                                        <p className="mt-1.5 m-0 font-mono text-[11.5px] text-dim">
                                            {plural(project._count?.files ?? 0, 'file')} ·{' '}
                                            {plural(project._count?.members ?? 1, 'member')} ·{' '}
                                            {project.ownerId === user?.id
                                                ? 'Owner'
                                                : 'Collaborator'}
                                        </p>
                                    </div>
                                    <LuArrowUpRight className="size-4 shrink-0 text-faint transition-colors group-hover:text-cream" />
                                </Link>

                                {project.ownerId === user?.id && (
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        aria-label={`Delete ${project.name}`}
                                        className="mr-4 rounded-lg p-2 text-faint transition-colors hover:text-danger-strong"
                                    >
                                        <LuTrash2 className="size-4" />
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </main>
        </div>
    )
}
