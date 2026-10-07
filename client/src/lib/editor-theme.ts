import type { Monaco } from '@monaco-editor/react'
import type { ResolvedTheme } from '@/lib/theme'

export const EDITOR_THEMES: Record<ResolvedTheme, string> = {
    dark: 'collabcode-dark',
    light: 'collabcode-light',
}

/** Monaco themes that match the app palette: the same page background as the
 *  rest of the workspace and warm syntax instead of vs/vs-dark blue. Both use
 *  one set of hues (coral keywords, green strings, orange numbers, violet
 *  types), tuned for contrast on black and on cream paper. The values mirror
 *  the --syntax-* tokens in index.css. */
export function defineEditorThemes(monaco: Monaco): void {
    monaco.editor.defineTheme(EDITOR_THEMES.dark, {
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
            'editorBracketHighlight.foreground1': '#ffa657',
            'editorBracketHighlight.foreground2': '#dcbdfb',
            'editorBracketHighlight.foreground3': '#7ee787',
        },
    })

    monaco.editor.defineTheme(EDITOR_THEMES.light, {
        base: 'vs',
        inherit: true,
        rules: [
            { token: '', foreground: '1c1915' },
            { token: 'comment', foreground: '8a8276', fontStyle: 'italic' },
            { token: 'keyword', foreground: 'cf222e' },
            { token: 'string', foreground: '116329' },
            { token: 'number', foreground: '953800' },
            { token: 'regexp', foreground: '116329' },
            { token: 'type', foreground: '8250df' },
            { token: 'type.identifier', foreground: '8250df' },
            { token: 'function', foreground: '8250df' },
            { token: 'variable', foreground: '1c1915' },
            { token: 'variable.parameter', foreground: '953800' },
            { token: 'constant', foreground: '953800' },
            { token: 'operator', foreground: 'cf222e' },
            { token: 'delimiter', foreground: '6e675e' },
            { token: 'tag', foreground: '116329' },
            { token: 'attribute.name', foreground: '953800' },
            { token: 'attribute.value', foreground: '116329' },
        ],
        colors: {
            'editor.background': '#faf8f3',
            'editor.foreground': '#1c1915',
            'editorLineNumber.foreground': '#b3ab9e',
            'editorLineNumber.activeForeground': '#4f4943',
            'editorCursor.foreground': '#1c1915',
            'editor.selectionBackground': '#e6dfd0',
            'editor.inactiveSelectionBackground': '#eee8dc',
            'editor.lineHighlightBackground': '#f3efe6',
            'editorIndentGuide.background1': '#e8e2d6',
            'editorIndentGuide.activeBackground1': '#cdc4b4',
            'editorWhitespace.foreground': '#e2dccf',
            'editorWidget.background': '#ffffff',
            'editorWidget.border': '#cdc4b4',
            'editorSuggestWidget.background': '#ffffff',
            'editorSuggestWidget.border': '#cdc4b4',
            'editorSuggestWidget.selectedBackground': '#f3efe6',
            'scrollbarSlider.background': '#e2dccf',
            'scrollbarSlider.hoverBackground': '#cdc4b4',
            'scrollbarSlider.activeBackground': '#a59d90',
            'editorBracketHighlight.foreground1': '#953800',
            'editorBracketHighlight.foreground2': '#8250df',
            'editorBracketHighlight.foreground3': '#116329',
        },
    })
}
