export type ConsoleLine = {
    id: string
    level: 'log' | 'error' | 'warn' | 'info' | 'system'
    text: string
}

export type RunResult = {
    lines: Omit<ConsoleLine, 'id'>[]
    durationMs: number
    timedOut: boolean
}

const TIMEOUT_MS = 3000

// Runs inside the worker. Console calls are forwarded to the main thread
// instead of the real console, which the worker does not share anyway.
const WORKER_SOURCE = `
self.onmessage = (event) => {
    const lines = []

    const format = (value) => {
        if (typeof value === 'string') return value
        if (value instanceof Error) return value.stack || String(value)
        try {
            return JSON.stringify(value, null, 2) ?? String(value)
        } catch {
            return String(value)
        }
    }

    const record = (level) => (...args) => {
        lines.push({ level, text: args.map(format).join(' ') })
    }

    self.console = {
        log: record('log'),
        info: record('info'),
        warn: record('warn'),
        error: record('error'),
        debug: record('log'),
    }

    try {
        // Indirect eval keeps the user's code out of this function's scope.
        ;(0, eval)(event.data)
    } catch (error) {
        lines.push({ level: 'error', text: format(error) })
    }

    self.postMessage(lines)
}
`

/**
 * Executes JavaScript in a Web Worker built from a blob URL, so it runs in an
 * opaque origin with no access to the page, its cookies or its storage. The
 * worker is terminated after TIMEOUT_MS, which also stops infinite loops.
 */
export function runJavaScript(code: string): Promise<RunResult> {
    return new Promise((resolve) => {
        const startedAt = performance.now()
        const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' })
        const url = URL.createObjectURL(blob)
        const worker = new Worker(url)

        let settled = false

        function finish(lines: Omit<ConsoleLine, 'id'>[], timedOut: boolean) {
            if (settled) return
            settled = true

            clearTimeout(timer)
            worker.terminate()
            URL.revokeObjectURL(url)

            resolve({ lines, durationMs: Math.round(performance.now() - startedAt), timedOut })
        }

        const timer = setTimeout(() => {
            finish([{ level: 'error', text: `Execution timed out after ${TIMEOUT_MS}ms` }], true)
        }, TIMEOUT_MS)

        worker.onmessage = (event: MessageEvent<Omit<ConsoleLine, 'id'>[]>) => {
            finish(event.data, false)
        }

        worker.onerror = (event) => {
            finish([{ level: 'error', text: event.message || 'Execution failed' }], false)
        }

        worker.postMessage(code)
    })
}
