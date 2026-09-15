import { createServer } from 'node:http'
import { app } from './app.js'
import { env } from './lib/env.js'

const httpServer = createServer(app)

// Bind on 0.0.0.0, not the default. A host platform reaches the container over
// IPv4, and the default binding leaves it unreachable from outside.
httpServer.listen(env.PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${env.PORT}`)
})

function shutdown(): void {
    httpServer.close(() => process.exit(0))
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
