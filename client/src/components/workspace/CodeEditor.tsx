import Editor from '@monaco-editor/react'
import { Spinner } from '@/components/ui/Spinner'
import type { SupportedLanguage } from '@/types'

type CodeEditorProps = {
    language: SupportedLanguage
    value: string
    onChange: (value: string) => void
}

export function CodeEditor({ language, value, onChange }: CodeEditorProps) {
    return (
        <Editor
            height="100%"
            theme="vs-dark"
            language={language}
            value={value}
            onChange={(next) => onChange(next ?? '')}
            loading={<Spinner className="size-5" />}
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
