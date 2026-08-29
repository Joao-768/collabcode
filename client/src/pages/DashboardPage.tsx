import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { LuPlus, LuTrash2, LuFolderCode, LuLogOut } from 'react-icons/lu'
import { useAuthStore } from '@/stores/auth.store'
import * as projectService from '@/services/project.service'
import { ApiError } from '@/services/api'
import { Spinner } from '@/components/ui/Spinner'
import type { Project } from '@/types'

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
                <div className="mx-auto flex max-w-240 items-center justify-between px-8 py-4">
                    <Link to="/" className="flex items-center gap-2.5">
                        <span className="flex size-7 items-center justify-center gap-0.75 rounded-[7px] border border-border-strong bg-surface-raised">
                            <span className="size-1 rounded-full bg-accent" />
                            <span className="size-1 rounded-full bg-[#3b6fef]" />
                            <span className="size-1 rounded-full bg-[#5b84f2]" />
                        </span>
                        <span className="text-[15px] font-semibold tracking-tight">CollabCode</span>
                    </Link>

                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-muted">{user?.name}</span>
                        <button
                            onClick={handleSignOut}
                            className="flex items-center gap-1.5 rounded-lg border border-border-strong px-3 py-1.5 text-muted hover:text-heading"
                        >
                            <LuLogOut className="size-3.5" />
                            Log out
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-240 px-8 py-10">
                <h1 className="m-0 text-2xl font-semibold tracking-tight">Your projects</h1>
                <p className="mt-1.5 mb-7 text-sm text-muted">
                    Create a room, share the link, and start coding together.
                </p>

                <form onSubmit={handleCreate} className="mb-8 flex gap-2.5">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="New project name"
                        maxLength={80}
                        className="flex-1 rounded-[9px] border border-border-strong bg-surface px-3.5 py-2.5 text-sm text-heading outline-none placeholder:text-dim focus:border-accent"
                    />
                    <button
                        type="submit"
                        disabled={creating || !name.trim()}
                        className="flex items-center gap-2 rounded-[9px] bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
                    >
                        {creating ? (
                            <Spinner className="size-4 border-white/40 border-t-white" />
                        ) : (
                            <LuPlus className="size-4" />
                        )}
                        Create
                    </button>
                </form>

                {error && (
                    <p className="mb-5 rounded-[9px] border border-red-900/60 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
                        {error}
                    </p>
                )}

                {loading ? (
                    <div className="grid place-items-center py-20">
                        <Spinner className="size-6" />
                    </div>
                ) : projects.length === 0 ? (
                    <div className="grid place-items-center rounded-[14px] border border-dashed border-border-strong py-20 text-center">
                        <LuFolderCode className="size-8 text-dim" />
                        <p className="mt-3 mb-1 text-sm font-medium text-heading">
                            No projects yet
                        </p>
                        <p className="m-0 text-sm text-muted">
                            Create your first room using the field above.
                        </p>
                    </div>
                ) : (
                    <ul className="m-0 grid list-none gap-3 p-0">
                        {projects.map((project) => (
                            <li
                                key={project.id}
                                className="flex items-center justify-between rounded-[12px] border border-border-strong bg-surface px-5 py-4 hover:border-[#3a3a3a]"
                            >
                                <Link to={`/workspace/${project.id}`} className="flex-1">
                                    <p className="m-0 text-[15px] font-medium text-heading">
                                        {project.name}
                                    </p>
                                    <p className="mt-1 m-0 font-mono text-xs text-dim">
                                        {project._count?.files ?? 0} files ·{' '}
                                        {project._count?.members ?? 1} members ·{' '}
                                        {project.ownerId === user?.id ? 'Owner' : 'Collaborator'}
                                    </p>
                                </Link>

                                {project.ownerId === user?.id && (
                                    <button
                                        onClick={() => handleDelete(project.id)}
                                        aria-label={`Delete ${project.name}`}
                                        className="rounded-lg border border-border-strong p-2 text-dim hover:border-red-900 hover:text-red-400"
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
