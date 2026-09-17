import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { env } from '../lib/env.js'

export function createSocketServer(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_ORIGIN,
            credentials: true,
        },
    })

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id)

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id)
        })
    })

    return io
}
