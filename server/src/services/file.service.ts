import { prisma } from '../lib/prisma.js'

export async function assertMember(projectId: string, userId: string) {
    const membership = await prisma.projectMember.findUnique({
        where: {
            userId_projectId: { userId, projectId },
        },
    })

    if (!membership) {
        throw new Error('Project not found')
    }
}

export async function getFile(fileId: string, userId: string) {
    const file = await prisma.file.findUnique({ where: { id: fileId } })

    if (!file) {
        throw new Error('File not found')
    }

    await assertMember(file.projectId, userId)

    return file
}

export async function createFile(projectId: string, name: string, userId: string) {
    await assertMember(projectId, userId)

    try {
        return await prisma.file.create({
            data: { name, projectId },
        })
    } catch (error) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'code' in error &&
            error.code === 'P2002'
        ) {
            throw new Error('File already exists')
        }
        throw error
    }
}

export async function listFiles(projectId: string, userId: string) {
    await assertMember(projectId, userId)
    return prisma.file.findMany({
        where: {
            projectId,
        },
        select: { id: true, name: true, updated_at: true },
    })
}

export async function updateFileContent(fileId: string, content: string, userId: string) {
    const file = await prisma.file.findUnique({ where: { id: fileId } })

    if (!file) {
        throw new Error('File not found')
    }

    await assertMember(file.projectId, userId)

    return prisma.file.update({
        where: { id: fileId },
        data: { content },
    })
}
