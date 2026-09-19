import { Server } from 'socket.io'
import type { Server as HttpServer } from 'node:http'
import { env } from '../lib/env.js'
import { parse } from 'cookie'
import { verifyToken } from '../lib/jwt.js'
import { assertMember } from '../services/file.service.js'
import { prisma } from '../lib/prisma.js'

export function createSocketServer(httpServer: HttpServer) {
    const io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_ORIGIN,
            credentials: true,
        },
    })

    io.use(async (socket, next) => {
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
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
            select: { id: true, name: true },
        })

        if (!user) {
            return next(new Error('Unauthorized'))
        }

        socket.data.user = user

        next()
    })

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id)

        socket.on('project:join', async ({ projectId }) => {
            try {
                await assertMember(projectId, socket.data.userId)
                socket.join(`project:${projectId}`)

                const room = `project:${projectId}`
                socket.data.rooms = [...(socket.data.rooms ?? []), room]

                // Everyone already in the room learns about the arrival.
                socket.to(room).emit('presence:joined', { user: socket.data.user })

                // The arriving socket learns who is already here. Sockets in a
                // room are the source of truth for presence: no table to keep
                // in sync, and a dropped connection removes itself.
                const sockets = await io.in(room).fetchSockets()
                const users = sockets.map((s) => s.data.user)

                socket.emit('presence:list', { users })
            } catch {
                socket.emit('error', { message: 'Project not found' })
            }
        })

        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id)

            // socket.rooms is already emptied by the time this fires, so the
            // rooms it was in come from the event's own argument.
            for (const room of socket.data.rooms ?? []) {
                socket.to(room).emit('presence:left', { user: socket.data.user })
            }
        })

        socket.on('file:update', ({ fileId, update }: { fileId: string; update: ArrayBuffer }) => {
            for (const room of socket.data.rooms ?? []) {
                socket.to(room).emit('file:update', { fileId, update })
            }
        })

        // A late joiner asks the room for its current state, and whoever is
        // already there answers with their whole document.
        socket.on('file:sync-request', ({ fileId }: { fileId: string }) => {
            for (const room of socket.data.rooms ?? []) {
                socket.to(room).emit('file:sync-request', { fileId, from: socket.id })
            }
        })

        socket.on(
            'file:sync-response',
            ({ to, fileId, update }: { to: string; fileId: string; update: ArrayBuffer }) => {
                io.to(to).emit('file:update', { fileId, update })
            },
        )
    })

    return io
}
