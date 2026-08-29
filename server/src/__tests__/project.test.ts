import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { prisma } from './setup.js'

async function signUp(email: string, name = 'User') {
    const response = await request(app)
        .post('/api/auth/register')
        .send({ email, name, password: 'password123' })

    return response.headers['set-cookie'] as unknown as string[]
}

async function createProject(cookie: string[], name = 'Test Project') {
    const response = await request(app).post('/api/projects').set('Cookie', cookie).send({ name })
    return response.body.project as { id: string; name: string; ownerId: string }
}

describe('POST /api/projects', () => {
    it('creates a project and makes the creator its owner', async () => {
        const cookie = await signUp('owner@example.com')

        const response = await request(app)
            .post('/api/projects')
            .set('Cookie', cookie)
            .send({ name: 'Test Project' })

        expect(response.status).toBe(201)
        expect(response.body.project.name).toBe('Test Project')

        const membership = await prisma.projectMember.findFirst({
            where: { projectId: response.body.project.id },
        })

        expect(membership?.role).toBe('OWNER')
    })

    it('rejects an empty name', async () => {
        const cookie = await signUp('owner@example.com')

        const response = await request(app)
            .post('/api/projects')
            .set('Cookie', cookie)
            .send({ name: '' })

        expect(response.status).toBe(400)
    })

    it('requires authentication', async () => {
        const response = await request(app).post('/api/projects').send({ name: 'Test Project' })

        expect(response.status).toBe(401)
    })
})

describe('GET /api/projects', () => {
    it('lists only the projects the caller belongs to', async () => {
        const owner = await signUp('owner@example.com')
        const stranger = await signUp('stranger@example.com')
        await createProject(owner)

        const ownerList = await request(app).get('/api/projects').set('Cookie', owner)
        const strangerList = await request(app).get('/api/projects').set('Cookie', stranger)

        expect(ownerList.body.projects).toHaveLength(1)
        expect(strangerList.body.projects).toHaveLength(0)
    })
})

describe('POST /api/projects/:id/join', () => {
    it('adds the caller as a collaborator', async () => {
        const owner = await signUp('owner@example.com')
        const guest = await signUp('guest@example.com')
        const project = await createProject(owner)

        const response = await request(app)
            .post(`/api/projects/${project.id}/join`)
            .set('Cookie', guest)

        expect(response.status).toBe(200)

        const membership = await prisma.projectMember.findFirst({
            where: { projectId: project.id, user: { email: 'guest@example.com' } },
        })

        expect(membership?.role).toBe('COLLABORATOR')
    })

    it('is idempotent when joining twice', async () => {
        const owner = await signUp('owner@example.com')
        const guest = await signUp('guest@example.com')
        const project = await createProject(owner)

        await request(app).post(`/api/projects/${project.id}/join`).set('Cookie', guest)
        const second = await request(app)
            .post(`/api/projects/${project.id}/join`)
            .set('Cookie', guest)

        expect(second.status).toBe(200)

        const count = await prisma.projectMember.count({
            where: { projectId: project.id, user: { email: 'guest@example.com' } },
        })

        expect(count).toBe(1)
    })

    it('404s for a project that does not exist', async () => {
        const cookie = await signUp('owner@example.com')

        const response = await request(app)
            .post('/api/projects/does-not-exist/join')
            .set('Cookie', cookie)

        expect(response.status).toBe(404)
    })
})

describe('DELETE /api/projects/:id', () => {
    it('cascades to files, members and messages', async () => {
        const owner = await signUp('owner@example.com')
        const project = await createProject(owner)

        await request(app)
            .post(`/api/projects/${project.id}/files`)
            .set('Cookie', owner)
            .send({ name: 'index.js' })

        const response = await request(app)
            .delete(`/api/projects/${project.id}`)
            .set('Cookie', owner)

        expect(response.status).toBe(204)
        expect(await prisma.file.count()).toBe(0)
        expect(await prisma.projectMember.count()).toBe(0)
    })
})
