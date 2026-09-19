import type { Monaco } from '@monaco-editor/react'

export const EDITOR_THEME = 'collabcode'

/** A Monaco theme matching the cream palette: the same background as the rest
 *  of the app, and warm syntax colours instead of vs-dark's blues. */
export function defineEditorTheme(monaco: Monaco): void {
    monaco.editor.defineTheme(EDITOR_THEME, {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: '', foreground: 'ece7dd' },
            { token: 'comment', foreground: '6b655c', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'ff9492' },
            { token: 'string', foreground: '7ee787' },
            { token: 'number', foreground: 'ffa657' },
            { token: 'regexp', foreground: '7ee787' },
            { token: 'type', foreground: 'dcbdfb' },
            { token: 'type.identifier', foreground: 'dcbdfb' },
            { token: 'function', foreground: 'dcbdfb' },
            { token: 'variable', foreground: 'ece7dd' },
            { token: 'variable.parameter', foreground: 'ffa657' },
            { token: 'constant', foreground: 'ffa657' },
            { token: 'operator', foreground: 'ff9492' },
            { token: 'delimiter', foreground: '9d968a' },
            { token: 'tag', foreground: '7ee787' },
            { token: 'attribute.name', foreground: 'ffa657' },
            { token: 'attribute.value', foreground: '7ee787' },
        ],
        colors: {
            'editor.background': '#0a0a0a',
            'editor.foreground': '#ece7dd',
            'editorLineNumber.foreground': '#46423c',
            'editorLineNumber.activeForeground': '#9d968a',
            'editorCursor.foreground': '#ece7dd',
            'editor.selectionBackground': '#2c2c2c',
            'editor.inactiveSelectionBackground': '#1e1e1e',
            'editor.lineHighlightBackground': '#101010',
            'editorIndentGuide.background1': '#1e1e1e',
            'editorIndentGuide.activeBackground1': '#2c2c2c',
            'editorWhitespace.foreground': '#1e1e1e',
            'editorWidget.background': '#101010',
            'editorWidget.border': '#2c2c2c',
            'editorSuggestWidget.background': '#101010',
            'editorSuggestWidget.border': '#2c2c2c',
            'editorSuggestWidget.selectedBackground': '#1e1e1e',
            'scrollbarSlider.background': '#1e1e1e',
            'scrollbarSlider.hoverBackground': '#2c2c2c',
            'scrollbarSlider.activeBackground': '#46423c',
        },
    })
}
