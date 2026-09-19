import { useEffect, useState } from 'react'
import Editor from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import * as Y from 'yjs'
import { MonacoBinding } from 'y-monaco'
import { Spinner } from '@/components/ui/Spinner'
import { EDITOR_THEME, defineEditorTheme } from '@/lib/editor-theme'
import type { Awareness } from 'y-protocols/awareness'

type CodeEditorProps = {
    awareness: Awareness | null
    doc: Y.Doc
    language: string
}

export function CodeEditor({ doc, awareness, language }: CodeEditorProps) {
    const [instance, setInstance] = useState<editor.IStandaloneCodeEditor | null>(null)

    useEffect(() => {
        const model = instance?.getModel()
        if (!instance || !model) return

        // One line replaces the hand-written diff and caret arithmetic: the
        // binding keeps the Y.Text and Monaco's model in step, and moves the
        // caret itself when a remote edit lands before it. Handed an awareness,
        // it also draws everyone else's cursors and selections.
        const binding = new MonacoBinding(
            doc.getText('content'),
            model,
            new Set([instance]),
            awareness,
        )

        return () => {
            binding.destroy()
        }
    }, [instance, doc, awareness])

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
                tabSize: 4,
                automaticLayout: true,
                cursorBlinking: 'smooth',
                lineNumbersMinChars: 4,
            }}
        />
    )
}
