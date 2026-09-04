import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import * as Y from 'yjs'
import type { Awareness } from 'y-protocols/awareness'
import { MonacoBinding } from 'y-monaco'
import { Spinner } from '@/components/ui/Spinner'
import { EDITOR_THEME, defineEditorTheme } from '@/lib/editor-theme'
import type { SupportedLanguage } from '@/types'

type CodeEditorProps = {
    language: SupportedLanguage
    doc: Y.Doc | null
    synced: boolean
    awareness: Awareness | null
}

export function CodeEditor({ language, doc, synced, awareness }: CodeEditorProps) {
    const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        const model = instance?.getModel()

        if (!instance || !model || !doc || !synced) return

        const binding = new MonacoBinding(
            doc.getText('content'),
            model,
            new Set([instance]),
            awareness,
        )

        return () => {
            binding.destroy()
        }
    }, [instance, doc, synced, awareness])

    return (
        <Editor
            height="100%"
            theme={EDITOR_THEME}
            language={language}
            loading={<Spinner className="size-5" />}
            beforeMount={defineEditorTheme}
            onMount={(editorInstance) => setInstance(editorInstance)}
            options={{
                fontSize: 13,
                fontFamily: "'Geist Mono', 'JetBrains Mono', ui-monospace, Consolas, monospace",
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                padding: { top: 18 },
                smoothScrolling: true,
                tabSize: 4,
                automaticLayout: true,
                renderLineHighlight: 'line',
                cursorBlinking: 'smooth',
                lineNumbersMinChars: 4,
                scrollbar: { verticalScrollbarSize: 10, horizontalScrollbarSize: 10 },
            }}
        />
    )
}
