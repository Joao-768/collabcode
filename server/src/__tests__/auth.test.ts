import { describe, it, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app.js'
import { prisma } from './setup.js'

const credentials = {
    email: 'joao@example.com',
    name: 'Joao',
    password: 'password123',
}

describe('POST /api/auth/register', () => {
    it('creates a user and sets an httpOnly cookie', async () => {
        const response = await request(app).post('/api/auth/register').send(credentials)

        expect(response.status).toBe(201)
        expect(response.body.user).toMatchObject({
            email: credentials.email,
            name: credentials.name,
        })
        expect(response.body.user).not.toHaveProperty('passwordHash')

        const cookie = response.headers['set-cookie'][0]
        expect(cookie).toContain('collabcode_token=')
        expect(cookie).toContain('HttpOnly')
        expect(cookie).toContain('SameSite=Lax')
    })

    it('stores the password as a bcrypt hash, never in plain text', async () => {
        await request(app).post('/api/auth/register').send(credentials)

        const user = await prisma.user.findUnique({ where: { email: credentials.email } })

        expect(user?.passwordHash).toBeDefined()
        expect(user?.passwordHash).not.toBe(credentials.password)
        expect(user?.passwordHash).toMatch(/^\$2[aby]\$/)
    })

    it('rejects a duplicate email', async () => {
        await request(app).post('/api/auth/register').send(credentials)
        const response = await request(app).post('/api/auth/register').send(credentials)

        expect(response.status).toBe(409)
        expect(response.body.error).toBe('Email already registered')
    })

    it.each([
        ['an invalid email', { ...credentials, email: 'not-an-email' }],
        ['a short password', { ...credentials, password: 'short' }],
        ['a short name', { ...credentials, name: 'J' }],
    ])('rejects %s', async (_label, body) => {
        const response = await request(app).post('/api/auth/register').send(body)

        expect(response.status).toBe(400)
        expect(response.body.error).toBe('Validation failed')
    })
})

describe('POST /api/auth/login', () => {
    it('accepts the right password', async () => {
        await request(app).post('/api/auth/register').send(credentials)

        const response = await request(app)
            .post('/api/auth/login')
            .send({ email: credentials.email, password: credentials.password })

        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe(credentials.email)
    })

    it.each([
        ['a wrong password', { email: credentials.email, password: 'wrongpassword' }],
        ['an unknown email', { email: 'nobody@example.com', password: credentials.password }],
    ])('rejects %s with the same message', async (_label, body) => {
        await request(app).post('/api/auth/register').send(credentials)

        const response = await request(app).post('/api/auth/login').send(body)

        expect(response.status).toBe(401)
        expect(response.body.error).toBe('Invalid email or password')
    })
})

describe('GET /api/auth/me', () => {
    it('returns the current user when authenticated', async () => {
        const registered = await request(app).post('/api/auth/register').send(credentials)
        const cookie = registered.headers['set-cookie']

        const response = await request(app).get('/api/auth/me').set('Cookie', cookie)

        expect(response.status).toBe(200)
        expect(response.body.user.email).toBe(credentials.email)
    })

    it('rejects a request with no cookie', async () => {
        const response = await request(app).get('/api/auth/me')

        expect(response.status).toBe(401)
    })

    it('rejects a forged token', async () => {
        const response = await request(app)
            .get('/api/auth/me')
            .set('Cookie', 'collabcode_token=not.a.real.token')

        expect(response.status).toBe(401)
    })
})

describe('POST /api/auth/logout', () => {
    it('clears the cookie so the session no longer works', async () => {
        const registered = await request(app).post('/api/auth/register').send(credentials)

        const loggedOut = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', registered.headers['set-cookie'])

        expect(loggedOut.status).toBe(204)

        const after = await request(app)
            .get('/api/auth/me')
            .set('Cookie', loggedOut.headers['set-cookie'])

        expect(after.status).toBe(401)
    })
})
