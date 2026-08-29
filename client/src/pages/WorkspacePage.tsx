import { useCallback, useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import * as projectService from '@/services/project.service'
import * as fileService from '@/services/file.service'
import { ApiError } from '@/services/api'
import { FileTree } from '@/components/workspace/FileTree'
import { CodeEditor } from '@/components/workspace/CodeEditor'
import { WorkspaceHeader } from '@/components/workspace/WorkspaceHeader'
import { Spinner } from '@/components/ui/Spinner'
import type { Project, ProjectFile, FileContent, SupportedLanguage } from '@/types'
import { SOCKET_EVENTS } from '@/services/socket'
import { useSocket } from '@/hooks/useSocket'
import { useYDoc } from '@/hooks/useYDoc'
import { usePresence } from '@/hooks/usePresence'
import { useAwareness } from '@/hooks/useAwareness'
import { useChat } from '@/hooks/useChat'
import { Chat } from '@/components/workspace/Chat'
import { Console } from '@/components/workspace/Console'
import { runJavaScript } from '@/lib/runner'
import type { ConsoleLine } from '@/lib/runner'
import { useAuthStore } from '@/stores/auth.store'

export function WorkspacePage() {
    const { id: projectId } = useParams<{ id: string }>()
    const currentUser = useAuthStore((s) => s.user)

    const [project, setProject] = useState<Project | null>(null)
    const [files, setFiles] = useState<ProjectFile[]>([])
    const [activeFile, setActiveFile] = useState<FileContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { socket, connected, socketError } = useSocket(projectId)
    const { doc, synced } = useYDoc(socket, activeFile?.id ?? null)
    const presentUsers = usePresence(socket)
    const myColor = presentUsers.find((u) => u.userId === currentUser?.id)?.color
    const awareness = useAwareness(
        socket,
        doc,
        activeFile?.id ?? null,
        currentUser ?? undefined,
        myColor,
    )
    const { messages, loading: chatLoading, send: sendMessage } = useChat(socket, projectId)

    const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([])
    const [running, setRunning] = useState(false)
    const canRun = activeFile?.language === 'javascript'
    const isOwner = project?.ownerId === currentUser?.id

    const handleRun = useCallback(async () => {
        if (!doc || !canRun) return

        setRunning(true)
        const code = doc.getText('content').toString()
        const result = await runJavaScript(code)

        setConsoleLines([
            ...result.lines.map((line, index) => ({ ...line, id: `${Date.now()}-${index}` })),
            {
                id: `${Date.now()}-done`,
                level: 'system' as const,
                text: result.timedOut
                    ? 'Process terminated'
                    : `Process finished in ${result.durationMs}ms`,
            },
        ])
        setRunning(false)
    }, [doc, canRun])

    useEffect(() => {
        if (!projectId) return
        let active = true

        async function load() {
            try {
                await projectService.joinProject(projectId!)
                const [{ project }, { files }] = await Promise.all([
                    projectService.getProject(projectId!),
                    fileService.listFiles(projectId!),
                ])

                if (!active) return

                setProject(project)
                setFiles(files)

                if (files[0]) {
                    const { file } = await fileService.getFile(files[0].id)
                    if (active) setActiveFile(file)
                }
            } catch (err) {
                if (active) {
                    setError(err instanceof ApiError ? err.message : 'Could not open this project')
                }
            } finally {
                if (active) setLoading(false)
            }
        }

        void load()

        return () => {
            active = false
        }
    }, [projectId])

    // Keep the file tree in step with what other people in the room do.
    useEffect(() => {
        if (!socket) return

        function handleCreated({ file }: { file: ProjectFile }) {
            setFiles((list) =>
                list.some((f) => f.id === file.id)
                    ? list
                    : [...list, file].sort((a, b) => a.name.localeCompare(b.name)),
            )
        }

        function handleRenamed({ file }: { file: ProjectFile }) {
            setFiles((list) =>
                list
                    .map((f) => (f.id === file.id ? file : f))
                    .sort((a, b) => a.name.localeCompare(b.name)),
            )
            setActiveFile((current) =>
                current && current.id === file.id ? { ...current, name: file.name } : current,
            )
        }

        function handleDeleted({ fileId }: { fileId: string }) {
            setFiles((list) => list.filter((f) => f.id !== fileId))
            setActiveFile((current) => (current && current.id === fileId ? null : current))
        }

        socket.on(SOCKET_EVENTS.FILE_CREATED, handleCreated)
        socket.on(SOCKET_EVENTS.FILE_RENAMED, handleRenamed)
        socket.on(SOCKET_EVENTS.FILE_DELETED, handleDeleted)

        return () => {
            socket.off(SOCKET_EVENTS.FILE_CREATED, handleCreated)
            socket.off(SOCKET_EVENTS.FILE_RENAMED, handleRenamed)
            socket.off(SOCKET_EVENTS.FILE_DELETED, handleDeleted)
        }
    }, [socket])

    const handleSelect = useCallback(async (fileId: string) => {
        try {
            const { file } = await fileService.getFile(fileId)
            setActiveFile(file)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not open that file')
        }
    }, [])

    const handleCreate = useCallback(
        async (name: string, language: SupportedLanguage) => {
            if (!projectId) return

            try {
                const { file } = await fileService.createFile(projectId, name, language)
                setFiles((list) => [...list, file].sort((a, b) => a.name.localeCompare(b.name)))
                await handleSelect(file.id)
                setError(null)
            } catch (err) {
                setError(err instanceof ApiError ? err.message : 'Could not create that file')
            }
        },
        [projectId, handleSelect],
    )

    const handleRename = useCallback(async (fileId: string, name: string) => {
        try {
            const { file } = await fileService.renameFile(fileId, name)
            setFiles((list) =>
                list
                    .map((f) => (f.id === fileId ? file : f))
                    .sort((a, b) => a.name.localeCompare(b.name)),
            )
            setActiveFile((current) =>
                current && current.id === fileId ? { ...current, name: file.name } : current,
            )
            setError(null)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not rename that file')
        }
    }, [])

    const handleDelete = useCallback(async (fileId: string) => {
        try {
            await fileService.deleteFile(fileId)
            setFiles((list) => list.filter((f) => f.id !== fileId))
            setActiveFile((current) => (current && current.id === fileId ? null : current))
            setError(null)
        } catch (err) {
            setError(err instanceof ApiError ? err.message : 'Could not delete that file')
        }
    }, [])

    if (loading) {
        return (
            <div className="grid min-h-svh place-items-center bg-canvas">
                <Spinner className="size-6" />
            </div>
        )
    }

    if (error && !project) {
        return (
            <div className="grid min-h-svh place-items-center bg-canvas px-8 text-center">
                <div>
                    <p className="m-0 text-sm font-medium text-heading">{error}</p>
                    <Link
                        to="/dashboard"
                        className="mt-4 inline-block text-sm text-accent hover:text-accent-hover"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-svh flex-col bg-canvas text-heading">
            <div className="grid place-items-center border-b border-border bg-surface px-4 py-2 text-center md:hidden">
                <p className="m-0 text-xs text-muted">
                    The workspace is built for desktop screens.
                </p>
            </div>

            <WorkspaceHeader
                projectName={project?.name ?? 'Workspace'}
                users={presentUsers}
                currentUserId={currentUser?.id}
                canRun={canRun}
                running={running}
                onRun={() => void handleRun()}
            />

            {(error ?? socketError) && (
                <p className="m-0 border-b border-red-900/60 bg-red-950/40 px-4 py-2 text-xs text-red-300">
                    {error ?? socketError}
                </p>
            )}

            {!connected && !socketError && (
                <p className="m-0 border-b border-amber-900/60 bg-amber-950/30 px-4 py-2 text-xs text-amber-300">
                    Connecting…
                </p>
            )}

            <div className="flex min-h-0 flex-1">
                <FileTree
                    files={files}
                    activeFileId={activeFile?.id ?? null}
                    canDelete={isOwner}
                    onSelect={handleSelect}
                    onCreate={handleCreate}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />

                <main className="min-w-0 flex-1">
                    {activeFile ? (
                        <CodeEditor
                            language={activeFile.language}
                            doc={doc}
                            synced={synced}
                            awareness={awareness}
                        />
                    ) : (
                        <div className="grid h-full place-items-center text-center">
                            <div>
                                <p className="m-0 text-sm text-muted">No file open</p>
                                <p className="mt-1 m-0 font-mono text-xs text-dim">
                                    Create or select a file to start coding
                                </p>
                            </div>
                        </div>
                    )}
                </main>

                <Chat
                    messages={messages}
                    loading={chatLoading}
                    currentUserId={currentUser?.id}
                    onSend={sendMessage}
                />
            </div>

            <Console lines={consoleLines} onClear={() => setConsoleLines([])} />
        </div>
    )
}
