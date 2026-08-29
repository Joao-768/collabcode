import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { env } from './lib/env.js'

export const app = express()

app.use(cors({ origin: env.CLIENT_ORIGIN, credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
})
