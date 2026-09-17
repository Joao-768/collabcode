import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { LuArrowLeft } from 'react-icons/lu'
import { FileTree } from '@/components/workspace/FileTree'
import type { ProjectFile } from '@/components/workspace/FileTree'
import { Spinner } from '@/components/ui/Spinner'
import { useSocket } from '@/hooks/useSocket'
import { usePresence } from '@/hooks/usePresence'
import { useAuth } from '@/context/authContext'
import { PresenceBar } from '@/components/workspace/PresenceBar'

type FileContent = ProjectFile & {
    content: string
}

export function WorkspacePage() {
    const { id: projectId } = useParams<{ id: string }>()

    const [files, setFiles] = useState<ProjectFile[]>([])
    const [activeFile, setActiveFile] = useState<FileContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const socket = useSocket(projectId)
    const presentUsers = usePresence(socket)
    const { user } = useAuth()

    useEffect(() => {
        async function fetchFiles() {
            if (!projectId) return

            setLoading(true)
            setError(null)

            try {
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/projects/${projectId}/files`,
                    { credentials: 'include' },
                )

                if (!response.ok) {
                    throw new Error(`Failed to fetch files: ${response.statusText}`)
                }
                const data = await response.json()
                setFiles(data.files)
            } catch (err) {
                setError((err as Error).message)
            } finally {
                setLoading(false)
            }
        }

        fetchFiles()
    }, [projectId])

    useEffect(() => {
        if (!activeFile) return

        const timer = setTimeout(() => {
            fetch(`${import.meta.env.VITE_API_URL}/files/${activeFile.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: activeFile.content }),
            }).catch(() => setError('Could not save'))
        }, 1000)

        return () => clearTimeout(timer)
    }, [activeFile?.id, activeFile?.content])

    async function handleSelect(fileId: string) {
        if (!projectId) return

        setError(null)

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${fileId}`, {
                credentials: 'include',
            })
            if (!response.ok) {
                throw new Error(`Failed to fetch file: ${response.statusText}`)
            }
            const data = await response.json()
            setActiveFile(data.file)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    async function handleCreate(name: string) {
        if (!projectId) return

        setError(null)

        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/projects/${projectId}/files`,
                {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                },
            )
            if (!response.ok) {
                throw new Error(`Failed to create file: ${response.statusText}`)
            }
            const data = await response.json()
            setFiles((prevFiles) => [...prevFiles, data.file])
            // The create response carries the content, so the new file can be
            // opened without a second request.
            setActiveFile(data.file)
        } catch (err) {
            setError((err as Error).message)
        }
    }

    useEffect(() => {
        if (!socket) return

        function handleChanged({ fileId, content }: { fileId: string; content: string }) {
            setActiveFile((current) =>
                current && current.id === fileId ? { ...current, content } : current,
            )
        }

        socket.on('file:changed', handleChanged)

        return () => {
            socket.off('file:changed', handleChanged)
        }
    }, [socket])

    if (loading) {
        return (
            <div className="grid min-h-svh place-items-center bg-canvas">
                <Spinner className="size-6" />
            </div>
        )
    }

    return (
        <div className="flex h-svh flex-col bg-canvas text-heading">
            <header className="flex shrink-0 items-center gap-3 border-b border-border px-4 py-3">
                <Link
                    to="/dashboard"
                    aria-label="Back to dashboard"
                    className="rounded-md p-1.5 text-dim transition-colors hover:bg-surface hover:text-cream"
                >
                    <LuArrowLeft className="size-4" />
                </Link>
                <span className="truncate font-serif text-lg leading-none text-cream">
                    Workspace
                </span>
                <div className="ml-auto">
                    <PresenceBar users={presentUsers} currentUserId={user?.id} />
                </div>
            </header>

            {error && (
                <p className="m-0 border-b border-red-900/50 bg-red-950/30 px-4 py-2.5 font-mono text-[11.5px] text-red-300">
                    {error}
                </p>
            )}

            <div className="flex min-h-0 flex-1">
                <FileTree
                    files={files}
                    activeFileId={activeFile?.id ?? null}
                    onSelect={handleSelect}
                    onCreate={handleCreate}
                />

                <main className="min-w-0 flex-1">
                    {activeFile ? (
                        <textarea
                            value={activeFile.content}
                            onChange={(e) => {
                                const content = e.target.value
                                setActiveFile({ ...activeFile, content })
                                socket?.emit('file:change', {
                                    fileId: activeFile.id,
                                    content,
                                })
                            }}

                            spellCheck={false}
                            className="h-full w-full resize-none bg-canvas p-4 font-mono text-[13.5px] leading-relaxed text-heading outline-none"
                        />
                    ) : (
                        <div className="grid h-full place-items-center px-8 text-center">
                            <div>
                                <p className="m-0 font-serif text-2xl text-heading">No file open</p>
                                <p className="mt-2 m-0 text-sm text-muted">
                                    Create or select a file to start editing.
                                </p>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
