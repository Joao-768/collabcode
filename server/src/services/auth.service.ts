import { prisma } from '../lib/prisma.js'
import { hashPassword } from '../lib/password.js'

export default async function registerUser(name: string, email: string, password: string) {
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
