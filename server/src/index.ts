import { createServer } from 'node:http'
import { app } from './app.js'
import { env } from './lib/env.js'
import { createSocketServer } from './websocket/index.js'
import { persistAll } from './websocket/room.manager.js'

const httpServer = createServer(app)

createSocketServer(httpServer)

httpServer.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
})

async function shutdown(): Promise<void> {
    await persistAll()
    httpServer.close(() => process.exit(0))
}

process.on('SIGINT', () => void shutdown())
process.on('SIGTERM', () => void shutdown())
