import type { ErrorRequestHandler, RequestHandler } from 'express'
import { AuthError } from '../services/auth.service.js'
import { env } from '../lib/env.js'

export const notFound: RequestHandler = (_req, res) => {
    res.status(404).json({ error: 'Not found' })
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    if (err instanceof AuthError) {
        res.status(err.status).json({ error: err.message })
        return
    }

    if (env.NODE_ENV !== 'test') {
        console.error(err)
    }

    res.status(500).json({ error: 'Internal server error' })
}
