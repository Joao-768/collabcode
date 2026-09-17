import { useState } from 'react'
import type { FormEvent } from 'react'
import { LuFile, LuPlus } from 'react-icons/lu'

export type ProjectFile = {
    id: string
    name: string
    updated_at: string
}

type FileTreeProps = {
    files: ProjectFile[]
    activeFileId: string | null
    onSelect: (fileId: string) => void
    onCreate: (name: string) => Promise<void>
}

export function FileTree({ files, activeFileId, onSelect, onCreate }: FileTreeProps) {
    const [creating, setCreating] = useState(false)
    const [newName, setNewName] = useState('')

    async function handleCreate(event: FormEvent) {
        event.preventDefault()
        if (!newName.trim()) return

        await onCreate(newName.trim())
        setNewName('')
        setCreating(false)
    }

    return (
        <aside className="flex h-full w-58 shrink-0 flex-col border-r border-border bg-canvas">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <span className="label text-dim">Files</span>
                <button
                    onClick={() => setCreating((v) => !v)}
                    aria-label="New file"
                    className="rounded-md p-1 text-dim transition-colors hover:bg-surface hover:text-cream"
                >
                    <LuPlus className="size-3.5" />
                </button>
            </div>

            {creating && (
                <form onSubmit={handleCreate} className="border-b border-border p-3">
                    <input
                        autoFocus
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="index.js"
                        maxLength={100}
                        className="w-full rounded-md border border-border-strong bg-surface px-2.5 py-1.5 font-mono text-xs text-heading outline-none transition-colors placeholder:text-faint focus:border-cream/50"
                    />
                </form>
            )}

            <ul className="m-0 flex-1 list-none overflow-y-auto p-2">
                {files.length === 0 ? (
                    <li className="px-2 py-4 text-center font-mono text-[11px] text-faint">
                        No files yet
                    </li>
                ) : (
                    files.map((file) => (
                        <li key={file.id}>
                            <button
                                onClick={() => onSelect(file.id)}
                                className={`flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors ${
                                    file.id === activeFileId
                                        ? 'bg-surface text-cream'
                                        : 'text-dim hover:bg-surface/60 hover:text-muted'
                                }`}
                            >
                                <LuFile className="size-3.5 shrink-0" />
                                <span className="truncate font-mono text-xs">{file.name}</span>
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </aside>
    )
}
