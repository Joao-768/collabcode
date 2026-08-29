import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { Spinner } from '@/components/ui/Spinner'
import type { SupportedLanguage } from '@/types'

type CodeEditorProps = {
    language: SupportedLanguage
    doc: Y.Doc | null
    synced: boolean
}

export function CodeEditor({ language, doc, synced }: CodeEditorProps) {
    const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        const model = instance?.getModel()

        if (!instance || !model || !doc || !synced) return

        const binding = new MonacoBinding(doc.getText('content'), model, new Set([instance]))

        return () => {
            binding.destroy()
        }
    }, [instance, doc, synced])

    return (
        <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            loading={<Spinner className="size-5" />}
            onMount={(editorInstance) => setInstance(editorInstance)}
            options={{
                fontSize: 13,
                fontFamily: "'JetBrains Mono', ui-monospace, Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 14 },
                smoothScrolling: true,
                tabSize: 4,
                automaticLayout: true,
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
            }}
        />
    )
}
