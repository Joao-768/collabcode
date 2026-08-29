import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './lib/env.js'
import { apiRoutes } from './routes/index.js'
import { notFound, errorHandler } from './middleware/error.middleware.js'

export const app = express()

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})

app.use('/api', apiRoutes)
app.use(notFound)
app.use(errorHandler)
