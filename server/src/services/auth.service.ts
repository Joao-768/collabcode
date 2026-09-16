import { prisma } from '../lib/prisma.js'
import { hashPassword, verifyPassword } from '../lib/password.js'

export async function registerUser(name: string, email: string, password: string) {
    const existing = await prisma.user.findUnique({ where: { email } })

    if (existing) {
        throw new Error('User already exists')
    }

    const hash = await hashPassword(password)

    return prisma.user.create({
        data: {
            name,
            email,
            password_hash: hash,
        },
        select: { id: true, name: true, email: true },
    })
}

export async function loginUser(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) {
        throw new Error('Invalid email or password')
    }

    const isValid = await verifyPassword(password, user.password_hash)

    if (!isValid) {
        throw new Error('Invalid email or password')
    }

    return { id: user.id, name: user.name, email: user.email }
}
