import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import { env } from './lib/env.js'
import { authRouter } from './routes/auth.routes.js'
import { projectRouter } from './routes/project.routes.js'
import { fileRouter } from './routes/file.routes.js'

export const app = express()

// Security headers, and drop the X-Powered-By fingerprint.
app.use(helmet())
app.disable('x-powered-by')

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json({ limit: '100kb' }))
app.use(cookieParser())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api/auth', authRouter)
app.use('/api/projects', projectRouter)
app.use('/api/files', fileRouter)
