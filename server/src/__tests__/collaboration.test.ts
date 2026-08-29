import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createServer, type Server as HttpServer } from 'node:http'
import { io as connect, type Socket } from 'socket.io-client'
import * as Y from 'yjs'
import request from 'supertest'
import { app } from '../app.js'
import { createSocketServer } from '../websocket/index.js'
import { prisma } from './setup.js'

const REMOTE = 'remote'

let httpServer: HttpServer
let url: string

beforeAll(async () => {
    httpServer = createServer(app)
    createSocketServer(httpServer)

    await new Promise<void>((resolve) => {
        httpServer.listen(0, () => resolve())
    })

    const address = httpServer.address()
    const port = typeof address === 'object' && address ? address.port : 0
    url = `http://localhost:${port}`
})

afterAll(async () => {
    await new Promise<void>((resolve) => {
        httpServer.close(() => resolve())
    })
})

async function signUp(email: string, name = 'User') {
    const response = await request(app)
        .post('/api/auth/register')
        .send({ email, name, password: 'password123' })

    return (response.headers['set-cookie'] as unknown as string[])[0]!.split(';')[0]!
}

function openSocket(cookie: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
        const socket = connect(url, {
            transports: ['websocket'],
            extraHeaders: { Cookie: cookie },
        })

        socket.on('connect', () => resolve(socket))
        socket.on('connect_error', (error) => reject(error))
    })
}

/** Connects, joins the room, syncs the file, and mirrors updates into a Y.Doc. */
async function openDocument(cookie: string, projectId: string, fileId: string) {
    const socket = await openSocket(cookie)
    const doc = new Y.Doc()

    socket.emit('room:join', { projectId })

    await new Promise<void>((resolve) => {
        socket.on('document:sync', ({ update }: { update: ArrayBuffer }) => {
            Y.applyUpdate(doc, new Uint8Array(update), REMOTE)
            resolve()
        })

        setTimeout(() => socket.emit('document:sync', { fileId }), 50)
    })

    socket.on('document:update', ({ update }: { update: ArrayBuffer }) => {
        Y.applyUpdate(doc, new Uint8Array(update), REMOTE)
    })

    doc.on('update', (update: Uint8Array, origin: unknown) => {
        if (origin !== REMOTE) {
            socket.emit('document:update', { fileId, update })
        }
    })

    return { socket, doc, text: () => doc.getText('content') }
}

const settle = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

let joaoCookie: string
let pedroCookie: string
let projectId: string
let fileId: string

beforeEach(async () => {
    joaoCookie = await signUp('joao@example.com', 'Joao')
    pedroCookie = await signUp('pedro@example.com', 'Pedro')

    const project = await request(app)
        .post('/api/projects')
        .set('Cookie', joaoCookie)
        .send({ name: 'Collab' })

    projectId = project.body.project.id

    const file = await request(app)
        .post(`/api/projects/${projectId}/files`)
        .set('Cookie', joaoCookie)
        .send({ name: 'index.js' })

    fileId = file.body.file.id

    await request(app).post(`/api/projects/${projectId}/join`).set('Cookie', pedroCookie)
})

describe('websocket authentication', () => {
    it('rejects a connection with no cookie', async () => {
        await expect(openSocket('')).rejects.toThrow('Not authenticated')
    })

    it('rejects a connection with a forged token', async () => {
        await expect(openSocket('collabcode_token=not.a.real.token')).rejects.toThrow(
            'Not authenticated',
        )
    })

    it('refuses to join a project the user is not a member of', async () => {
        const outsider = await signUp('outsider@example.com')
        const socket = await openSocket(outsider)

        const error = await new Promise<string>((resolve) => {
            socket.on('room:error', ({ error }: { error: string }) => resolve(error))
            socket.emit('room:join', { projectId })
        })

        expect(error).toBe('Not a member of this project')
        socket.close()
    })
})

describe('document synchronisation', () => {
    it('propagates an edit from one client to the other', async () => {
        const joao = await openDocument(joaoCookie, projectId, fileId)
        const pedro = await openDocument(pedroCookie, projectId, fileId)

        joao.text().insert(0, 'const user = "Joao";')
        await settle()

        expect(pedro.text().toString()).toBe('const user = "Joao";')

        joao.socket.close()
        pedro.socket.close()
    })

    it('keeps both concurrent edits and converges', async () => {
        const joao = await openDocument(joaoCookie, projectId, fileId)
        const pedro = await openDocument(pedroCookie, projectId, fileId)

        joao.text().insert(0, 'line one\n')
        await settle()

        // Both edit at the same moment, at different offsets.
        joao.text().insert(joao.text().length, 'JOAO\n')
        pedro.text().insert(pedro.text().length, 'PEDRO\n')
        await settle(700)

        const left = joao.text().toString()
        const right = pedro.text().toString()

        expect(left).toBe(right)
        expect(left).toContain('JOAO')
        expect(left).toContain('PEDRO')

        joao.socket.close()
        pedro.socket.close()
    })

    it('does not leak updates into another project’s room', async () => {
        const other = await request(app)
            .post('/api/projects')
            .set('Cookie', pedroCookie)
            .send({ name: 'Other' })

        const otherFile = await request(app)
            .post(`/api/projects/${other.body.project.id}/files`)
            .set('Cookie', pedroCookie)
            .send({ name: 'index.js' })

        const joao = await openDocument(joaoCookie, projectId, fileId)
        const pedro = await openDocument(pedroCookie, other.body.project.id, otherFile.body.file.id)

        joao.text().insert(0, 'secret')
        await settle()

        expect(pedro.text().toString()).toBe('')

        joao.socket.close()
        pedro.socket.close()
    })
})

describe('persistence', () => {
    it('saves the CRDT state and a text snapshot when the last client leaves', async () => {
        const joao = await openDocument(joaoCookie, projectId, fileId)

        joao.text().insert(0, 'persisted content')
        await settle()

        joao.socket.close()
        await settle(1200)

        const saved = await prisma.file.findUnique({
            where: { id: fileId },
            select: { content: true, ydoc: true },
        })

        expect(saved?.content).toBe('persisted content')
        expect(saved?.ydoc).toBeTruthy()

        // The binary state must rebuild the same document, not just the text.
        const restored = new Y.Doc()
        Y.applyUpdate(restored, new Uint8Array(saved!.ydoc!))

        expect(restored.getText('content').toString()).toBe('persisted content')
    })

    it('restores previous content for a client joining later', async () => {
        const first = await openDocument(joaoCookie, projectId, fileId)
        first.text().insert(0, 'written earlier')
        await settle()
        first.socket.close()
        await settle(1200)

        const second = await openDocument(pedroCookie, projectId, fileId)

        expect(second.text().toString()).toBe('written earlier')

        second.socket.close()
    })
})

describe('resilience', () => {
    it('survives the file being deleted while a client has it open', async () => {
        const joao = await openDocument(joaoCookie, projectId, fileId)

        joao.text().insert(0, 'about to disappear')
        await settle(200)

        await request(app).delete(`/api/files/${fileId}`).set('Cookie', joaoCookie)

        // The pending debounced save now targets a row that is gone.
        joao.socket.close()
        await settle(1500)

        // The server must still be answering requests.
        const response = await request(app).get('/api/auth/me').set('Cookie', joaoCookie)
        expect(response.status).toBe(200)
    })
})

describe('chat', () => {
    it('delivers a message to everyone in the room and stores it', async () => {
        const joao = await openSocket(joaoCookie)
        const pedro = await openSocket(pedroCookie)

        joao.emit('room:join', { projectId })
        pedro.emit('room:join', { projectId })
        await settle(200)

        const received = new Promise<{ content: string; user: { name: string } }>((resolve) => {
            pedro.on('chat:message', ({ message }) => resolve(message))
        })

        joao.emit('chat:message', { content: 'Vamos alterar esta funcao.' })

        const message = await received

        expect(message.content).toBe('Vamos alterar esta funcao.')
        expect(message.user.name).toBe('Joao')

        const stored = await prisma.message.count({ where: { projectId } })
        expect(stored).toBe(1)

        joao.close()
        pedro.close()
    })
})
