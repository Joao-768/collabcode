import type { Request, Response } from 'express'
import { createProjectSchema } from '../schemas/project.schema.js'
import { formatIssues } from '../lib/validation.js'
import { createProject, listProjects, deleteProject } from '../services/project.service.js'

export async function create(req: Request, res: Response) {
    const parsed = createProjectSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: formatIssues(parsed.error) })
    }

    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const project = await createProject(parsed.data.name, req.userId)
        res.status(201).json({ project })
    } catch {
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function list(req: Request, res: Response) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const projects = await listProjects(req.userId)
        res.json({ projects })
    } catch {
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function remove(req: Request, res: Response) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const projectId = req.params.projectId as string

    try {
        await deleteProject(projectId, req.userId)
        res.status(204).send()
    } catch (error) {
        if (error instanceof Error && error.message === 'Project not found') {
            return res.status(404).json({ error: error.message })
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}
