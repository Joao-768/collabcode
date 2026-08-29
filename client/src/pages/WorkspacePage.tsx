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

export function WorkspacePage() {
    const { id: projectId } = useParams<{ id: string }>()

    const [project, setProject] = useState<Project | null>(null)
    const [files, setFiles] = useState<ProjectFile[]>([])
    const [activeFile, setActiveFile] = useState<FileContent | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

            <WorkspaceHeader projectName={project?.name ?? 'Workspace'} />

            {error && (
                <p className="m-0 border-b border-red-900/60 bg-red-950/40 px-4 py-2 text-xs text-red-300">
                    {error}
                </p>
            )}

            <div className="flex min-h-0 flex-1">
                <FileTree
                    files={files}
                    activeFileId={activeFile?.id ?? null}
                    onSelect={handleSelect}
                    onCreate={handleCreate}
                    onRename={handleRename}
                    onDelete={handleDelete}
                />

                <main className="min-w-0 flex-1">
                    {activeFile ? (
                        <CodeEditor
                            language={activeFile.language}
                            value={activeFile.content}
                            onChange={(value) =>
                                setActiveFile((current) =>
                                    current ? { ...current, content: value } : current,
                                )
                            }
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
            </div>
        </div>
    )
}
