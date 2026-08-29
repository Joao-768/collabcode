import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'

type Cookie = string[]

async function signUp(email: string, name = 'User'): Promise<Cookie> {
    const response = await request(app)
        .post('/api/auth/register')
        .send({ email, name, password: 'password123' })

    return response.headers['set-cookie'] as unknown as Cookie
}

let owner: Cookie
let collaborator: Cookie
let outsider: Cookie
let projectId: string
let fileId: string

beforeEach(async () => {
    owner = await signUp('owner@example.com', 'Owner')
    collaborator = await signUp('collab@example.com', 'Collaborator')
    outsider = await signUp('outsider@example.com', 'Outsider')

    const project = await request(app)
        .post('/api/projects')
        .set('Cookie', owner)
        .send({ name: 'Shared Project' })

    projectId = project.body.project.id

    await request(app).post(`/api/projects/${projectId}/join`).set('Cookie', collaborator)

    const file = await request(app)
        .post(`/api/projects/${projectId}/files`)
        .set('Cookie', owner)
        .send({ name: 'index.js' })

    fileId = file.body.file.id
})

describe('collaborator permissions', () => {
    it('can create a file', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/files`)
            .set('Cookie', collaborator)
            .send({ name: 'utils.js' })

        expect(response.status).toBe(201)
    })

    it('can rename a file', async () => {
        const response = await request(app)
            .patch(`/api/files/${fileId}`)
            .set('Cookie', collaborator)
            .send({ name: 'renamed.js' })

        expect(response.status).toBe(200)
    })

    it('can read the chat', async () => {
        const response = await request(app)
            .get(`/api/projects/${projectId}/messages`)
            .set('Cookie', collaborator)

        expect(response.status).toBe(200)
    })

    it('cannot delete a file', async () => {
        const response = await request(app)
            .delete(`/api/files/${fileId}`)
            .set('Cookie', collaborator)

        expect(response.status).toBe(403)
    })

    it('cannot delete the project', async () => {
        const response = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Cookie', collaborator)

        expect(response.status).toBe(403)
    })
})

describe('owner permissions', () => {
    it('can delete a file', async () => {
        const response = await request(app).delete(`/api/files/${fileId}`).set('Cookie', owner)

        expect(response.status).toBe(204)
    })

    it('can delete the project', async () => {
        const response = await request(app)
            .delete(`/api/projects/${projectId}`)
            .set('Cookie', owner)

        expect(response.status).toBe(204)
    })
})

describe('non-member access', () => {
    it.each([
        ['reading the project', () => request(app).get(`/api/projects/${projectId}`)],
        ['listing files', () => request(app).get(`/api/projects/${projectId}/files`)],
        ['reading messages', () => request(app).get(`/api/projects/${projectId}/messages`)],
        ['reading a file', () => request(app).get(`/api/files/${fileId}`)],
    ])('404s when %s, hiding that the project exists', async (_label, call) => {
        const response = await call().set('Cookie', outsider)

        expect(response.status).toBe(404)
    })

    it('cannot create a file in someone else’s project', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/files`)
            .set('Cookie', outsider)
            .send({ name: 'intruder.js' })

        expect(response.status).toBe(404)
    })
})

describe('file validation', () => {
    it('rejects a duplicate file name in the same project', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/files`)
            .set('Cookie', owner)
            .send({ name: 'index.js' })

        expect(response.status).toBe(409)
    })

    it('rejects path traversal in a file name', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/files`)
            .set('Cookie', owner)
            .send({ name: '../../etc/passwd' })

        expect(response.status).toBe(400)
    })

    it('rejects an unsupported language', async () => {
        const response = await request(app)
            .post(`/api/projects/${projectId}/files`)
            .set('Cookie', owner)
            .send({ name: 'script.py', language: 'python' })

        expect(response.status).toBe(400)
    })
})
