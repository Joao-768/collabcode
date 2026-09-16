import { prisma } from '../lib/prisma.js'

export function createProject(name: string, ownerId: string) {
    return prisma.project.create({
        data: {
            name,
            ownerId,
            members: {
                create: {
                    userId: ownerId,
                    role: 'OWNER',
                },
            },
        },
    })
}

export function listProjects(userId: string) {
    return prisma.project.findMany({
        where: {
            members: {
                some: { userId },
            },
        },
    })
}

export async function deleteProject(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
        where: { id: projectId },
    })

    if (!project) {
        throw new Error('Project not found')
    }

    if (project.ownerId !== userId) {
        throw new Error('Project not found')
    }

    return prisma.project.delete({
        where: { id: projectId },
    })
}
