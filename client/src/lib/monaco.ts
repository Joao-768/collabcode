import { loader } from '@monaco-editor/react'
import * as monaco from 'monaco-editor'
import EditorWorker from 'monaco-editor/editor/editor.worker?worker'
import TsWorker from 'monaco-editor/language/typescript/ts.worker?worker'
import JsonWorker from 'monaco-editor/language/json/json.worker?worker'
import CssWorker from 'monaco-editor/language/css/css.worker?worker'
import HtmlWorker from 'monaco-editor/language/html/html.worker?worker'

// Bundle Monaco with the app instead of letting @monaco-editor/react fetch it
// from jsdelivr: the CSP blocks third-party scripts, and y-monaco already
// imports this local copy, so the editor and the binding share one instance.
self.MonacoEnvironment = {
    getWorker(_workerId, label) {
        switch (label) {
            case 'typescript':
            case 'javascript':
                return new TsWorker()
            case 'json':
                return new JsonWorker()
            case 'css':
            case 'scss':
            case 'less':
                return new CssWorker()
            case 'html':
            case 'handlebars':
            case 'razor':
                return new HtmlWorker()
            default:
                return new EditorWorker()
        }
    },
}

loader.config({ monaco })
