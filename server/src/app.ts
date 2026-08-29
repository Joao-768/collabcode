import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import cookieParser from 'cookie-parser'
import { env } from './lib/env.js'
import { apiRoutes } from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.middleware.js'

export const app = express()

// Security headers, and drop the X-Powered-By fingerprint.
app.use(helmet())
app.disable('x-powered-by')

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

// Credential endpoints are the ones worth brute-forcing, so they get a
// tighter budget than the rest of the API.
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: env.NODE_ENV === 'test' ? 1000 : 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many attempts, please try again later' },
})

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth/login', authLimiter)
app.use('/api/auth/register', authLimiter)

app.use('/api', apiRoutes)
app.use(notFound)
app.use(errorHandler)
