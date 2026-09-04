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
        // Safari's stack omits the message, so lead with it and append the
        // stack's own frames only when it does not already repeat it.
        if (value instanceof Error) {
            const head = (value.name || 'Error') + ': ' + value.message
            const stack = value.stack || ''
            return stack.startsWith(head) ? stack : head
        }
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

    // The browser dialogs do not exist in a worker. Stub them so code written
    // for the browser still runs: output is echoed to the console, and prompt
    // returns a queued answer supplied with the run, or null when none is left.
    const answers = (event.data.inputs || []).slice()
    let starved = false

    self.alert = (message) => {
        lines.push({ level: 'system', text: 'alert: ' + format(message) })
    }

    self.confirm = (message) => {
        const answer = answers.length ? answers.shift() : null
        const result = answer === null ? false : !/^(n|no|false|0)$/i.test(answer.trim())
        lines.push({ level: 'system', text: 'confirm: ' + format(message) + ' -> ' + result })
        return result
    }

    self.prompt = (message, fallback) => {
        const answer = answers.length ? answers.shift() : (fallback ?? null)
        if (answer === null) starved = true
        lines.push({
            level: 'system',
            text: 'prompt: ' + format(message) + ' -> ' + (answer === null ? '(no input)' : answer),
        })
        return answer
    }

    try {
        // Indirect eval keeps the user's code out of this function's scope.
        ;(0, eval)(event.data.code)
    } catch (error) {
        lines.push({ level: 'error', text: format(error) })
    }

    if (starved) {
        lines.push({
            level: 'warn',
            text: 'Some prompt() calls had no answer. Type them in the Input box below, separated by commas, then Run again.',
        })
    }

    self.postMessage(lines)
}
`

/**
 * Executes JavaScript in a Web Worker built from a blob URL, so it runs in an
 * opaque origin with no access to the page, its cookies or its storage. The
 * worker is terminated after TIMEOUT_MS, which also stops infinite loops.
 *
 * `inputs` answers prompt()/confirm() calls in order, since a worker cannot
 * open a dialog or block on the main thread for a reply.
 */
export function runJavaScript(code: string, inputs: string[] = []): Promise<RunResult> {
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

        worker.postMessage({ code, inputs })
    })
}
