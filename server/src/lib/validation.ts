import type { ZodError } from 'zod'

/**
 * Turns a Zod error into a field-to-message map for the client.
 *
 * The raw issues carry the library's own internals, including the email
 * regex, which the client has no use for and which describe how validation
 * is implemented rather than what went wrong.
 */
export function formatIssues(error: ZodError): Record<string, string> {
    const errors: Record<string, string> = {}

    for (const issue of error.issues) {
        const field = String(issue.path[0] ?? '')

        // Keep the first message per field: a form shows one line per input.
        if (field && !errors[field]) {
            errors[field] = issue.message
        }
    }

    return errors
}
