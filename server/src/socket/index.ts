import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { env } from '../lib/env.js'
import { parse } from 'cookie'
import { verifyToken } from '../lib/jwt.js'

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

    io.use((socket, next) => {
        const raw = socket.handshake.headers.cookie

        if (!raw) {
            return next(new Error('Unauthorized'))
        }

        const token = parse(raw).token

        if (!token) {
            return next(new Error('Unauthorized'))
        }

        const payload = verifyToken(token)

        if (!payload) {
            return next(new Error('Unauthorized'))
        }

        socket.data.userId = payload.id
        next()
    })

    return io
}
