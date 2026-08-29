import { useState } from 'react'
import type { FormEvent } from 'react'
import { LuFile, LuPlus, LuTrash2, LuPencil } from 'react-icons/lu'
import { SUPPORTED_LANGUAGES } from '@/types'
import type { ProjectFile, SupportedLanguage } from '@/types'

type FileTreeProps = {
    files: ProjectFile[]
    activeFileId: string | null
    onSelect: (fileId: string) => void
    onCreate: (name: string, language: SupportedLanguage) => Promise<void>
    onRename: (fileId: string, name: string) => Promise<void>
    onDelete: (fileId: string) => Promise<void>
}

export function FileTree({
    files,
    activeFileId,
    onSelect,
    onCreate,
    onRename,
    onDelete,
}: FileTreeProps) {
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')
    const [newLanguage, setNewLanguage] = useState<SupportedLanguage>('javascript')
    const [renamingId, setRenamingId] = useState<string | null>(null)
    const [renameValue, setRenameValue] = useState('')

    async function handleCreate(event: FormEvent) {
        event.preventDefault()
        if (!newName.trim()) return

        await onCreate(newName.trim(), newLanguage)
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
        <aside className="flex h-full w-56 flex-col border-r border-border bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                <span className="font-mono text-[11px] tracking-[0.08em] text-dim">FILES</span>
                <button
                    onClick={() => setCreating((v) => !v)}
                    aria-label="New file"
                    className="rounded p-1 text-dim hover:bg-surface-raised hover:text-heading"
                >
                    <LuPlus className="size-3.5" />
                </button>
            </div>

            {creating && (
                <form onSubmit={handleCreate} className="border-b border-border p-2.5">
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && setCreating(false)}
                        placeholder="index.js"
                        className="w-full rounded border border-border-strong bg-canvas px-2 py-1.5 font-mono text-xs text-heading outline-none placeholder:text-dim focus:border-accent"
                    />
                    <select
                        value={newLanguage}
                        onChange={(e) => setNewLanguage(e.target.value as SupportedLanguage)}
                        className="mt-1.5 w-full rounded border border-border-strong bg-canvas px-2 py-1.5 font-mono text-xs text-muted outline-none focus:border-accent"
                    >
                        {SUPPORTED_LANGUAGES.map((lang) => (
                            <option key={lang} value={lang}>
                                {lang}
                            </option>
                        ))}
                    </select>
                </form>
            )}

            <ul className="m-0 flex-1 list-none overflow-y-auto p-1.5">
                {files.length === 0 && !creating && (
                    <li className="px-2 py-3 text-center font-mono text-[11px] text-dim">
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
                                    className="w-full rounded border border-accent bg-canvas px-2 py-1 font-mono text-xs text-heading outline-none"
                                />
                            </form>
                        ) : (
                            <div
                                className={`flex items-center gap-1.5 rounded px-2 py-1.5 ${
                                    activeFileId === file.id
                                        ? 'bg-surface-raised text-heading'
                                        : 'text-muted hover:bg-surface-raised/60'
                                }`}
                            >
                                <button
                                    onClick={() => onSelect(file.id)}
                                    className="flex flex-1 items-center gap-1.5 overflow-hidden text-left"
                                >
                                    <LuFile className="size-3.5 shrink-0 text-dim" />
                                    <span className="truncate font-mono text-xs">{file.name}</span>
                                </button>

                                <span className="hidden shrink-0 items-center gap-0.5 group-hover:flex">
                                    <button
                                        onClick={() => {
                                            setRenamingId(file.id)
                                            setRenameValue(file.name)
                                        }}
                                        aria-label={`Rename ${file.name}`}
                                        className="rounded p-0.5 text-dim hover:text-heading"
                                    >
                                        <LuPencil className="size-3" />
                                    </button>
                                    <button
                                        onClick={() => void onDelete(file.id)}
                                        aria-label={`Delete ${file.name}`}
                                        className="rounded p-0.5 text-dim hover:text-red-400"
                                    >
                                        <LuTrash2 className="size-3" />
                                    </button>
                                </span>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </aside>
    )
}
