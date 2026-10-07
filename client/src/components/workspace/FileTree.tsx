import { useState } from 'react'
import type { FormEvent } from 'react'
import { LuChevronLeft, LuFile, LuPlus, LuTrash2, LuPencil } from 'react-icons/lu'
import { languageFromName } from '@/types'
import type { ProjectFile, SupportedLanguage } from '@/types'

type FileTreeProps = {
    files: ProjectFile[]
    activeFileId: string | null
    canDelete: boolean
    onSelect: (fileId: string) => void
    onCreate: (name: string, language: SupportedLanguage) => Promise<void>
    onRename: (fileId: string, name: string) => Promise<void>
    onDelete: (fileId: string) => Promise<void>
    onCollapse: () => void
}

export function FileTree({
    files,
    activeFileId,
    canDelete,
    onSelect,
    onCreate,
    onRename,
    onDelete,
    onCollapse,
}: FileTreeProps) {
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')

    async function handleCreate(event: FormEvent) {
        event.preventDefault()
        if (!newName.trim()) return

        // The extension already says what the file is, so it is read from the
        // name rather than asked for a second time.
        await onCreate(newName.trim(), languageFromName(newName.trim()))
        setNewName('')
        setCreating(false)
    }

    async function handleRename(event: FormEvent, fileId: string) {
        event.preventDefault()
        if (!renameValue.trim()) return

        await onRename(fileId, renameValue.trim())
        setRenamingId(null)
    }

    return (
        <aside className="flex h-full w-58 flex-col border-r border-border bg-canvas">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="label text-dim">Files</span>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => setCreating((v) => !v)}
                        aria-label="New file"
                        className="rounded-md p-1 text-dim transition-colors hover:bg-surface hover:text-cream"
                    >
                        <LuPlus className="size-3.5" />
                    </button>
                    <button
                        onClick={onCollapse}
                        aria-label="Hide files"
                        className="rounded-md p-1 text-dim transition-colors hover:bg-surface hover:text-cream"
                    >
                        <LuChevronLeft className="size-3.5" />
                    </button>
                </div>
            </div>

            {creating && (
                <form
                    onSubmit={handleCreate}
                    className="flex flex-col gap-2 border-b border-border p-3"
                >
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && setCreating(false)}
                        placeholder="index.js"
                        className="w-full rounded-md border border-border-strong bg-surface px-2.5 py-1.5 font-mono text-xs text-heading outline-none transition-colors placeholder:text-faint focus:border-cream/50"
                    />
                </form>
            )}

            <ul className="m-0 flex-1 list-none overflow-y-auto p-2">
                {files.length === 0 && !creating && (
                    <li className="px-2 py-4 text-center font-mono text-[11px] text-faint">
                        No files yet
                    </li>
                )}

                {files.map((file) => (
                    <li key={file.id} className="group relative">
                        {renamingId === file.id ? (
                            <form onSubmit={(e) => handleRename(e, file.id)} className="p-1">
                                <input
                                    autoFocus
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Escape' && setRenamingId(null)}
                                    onBlur={() => setRenamingId(null)}
                                    className="w-full rounded-md border border-cream/50 bg-surface px-2.5 py-1.5 font-mono text-xs text-heading outline-none"
                                />
                            </form>
                        ) : (
                            <div
                                className={`flex items-center gap-2 rounded-md px-2.5 py-2 transition-colors ${
                                    activeFileId === file.id
                                        ? 'bg-surface-raised text-cream'
                                        : 'text-muted hover:bg-surface'
                                }`}
                            >
                                <button
                                    onClick={() => onSelect(file.id)}
                                    className="flex flex-1 items-center gap-2 overflow-hidden text-left"
                                >
                                    <LuFile
                                        className={`size-3.5 shrink-0 ${
                                            activeFileId === file.id ? 'text-cream' : 'text-faint'
                                        }`}
                                    />
                                    <span className="truncate font-mono text-xs">{file.name}</span>
                                </button>

                                <span className="flex shrink-0 items-center gap-1 md:hidden md:group-hover:flex">
                                    <button
                                        onClick={() => {
                                            setRenamingId(file.id)
                                            setRenameValue(file.name)
                                        }}
                                        aria-label={`Rename ${file.name}`}
                                        className="rounded p-0.5 text-faint transition-colors hover:text-cream"
                                    >
                                        <LuPencil className="size-3" />
                                    </button>
                                    {canDelete && (
                                        <button
                                            onClick={() => void onDelete(file.id)}
                                            aria-label={`Delete ${file.name}`}
                                            className="rounded p-0.5 text-faint transition-colors hover:text-danger-strong"
                                        >
                                            <LuTrash2 className="size-3" />
                                        </button>
                                    )}
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    )
}
