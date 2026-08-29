import { config } from 'dotenv'
import { beforeAll, afterAll, beforeEach } from 'vitest'

// Loaded before anything imports lib/env, so the test database is used.
config({ path: '.env.test', override: true })

const { prisma } = await import('../lib/prisma.js')

beforeAll(async () => {
    await prisma.$connect()
})

beforeEach(async () => {
    // Users cascade to projects, memberships, files and messages.
    await prisma.user.deleteMany()
})

afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
})

export { prisma }
