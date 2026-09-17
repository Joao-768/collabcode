import type { Request, Response } from 'express'
import { createFileSchema, updateFileSchema } from '../schemas/file.schema.js'
import { formatIssues } from '../lib/validation.js'
import { listFiles, createFile, getFile, updateFileContent } from '../services/file.service.js'

// The service answers not-found both for a missing row and for a project the
// caller is not a member of, so either message maps to 404 here.
function isNotFound(error: unknown): boolean {
    return (
        error instanceof Error &&
        (error.message === 'File not found' || error.message === 'Project not found')
    )
}

export async function list(req: Request, res: Response) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const projectId = req.params.projectId as string

    try {
        const files = await listFiles(projectId, req.userId)
        res.json({ files })
    } catch (error) {
        if (isNotFound(error)) {
            return res.status(404).json({ error: (error as Error).message })
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function create(req: Request, res: Response) {
    const parsed = createFileSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: formatIssues(parsed.error) })
    }

    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const projectId = req.params.projectId as string

    try {
        const file = await createFile(projectId, parsed.data.name, req.userId)
        res.status(201).json({ file })
    } catch (error) {
        if (error instanceof Error && error.message === 'File already exists') {
            return res.status(409).json({ error: error.message })
        }

        if (isNotFound(error)) {
            return res.status(404).json({ error: (error as Error).message })
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function get(req: Request, res: Response) {
    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const fileId = req.params.fileId as string

    try {
        const file = await getFile(fileId, req.userId)
        res.json({ file })
    } catch (error) {
        if (isNotFound(error)) {
            return res.status(404).json({ error: (error as Error).message })
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function update(req: Request, res: Response) {
    const parsed = updateFileSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: formatIssues(parsed.error) })
    }

    if (!req.userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const fileId = req.params.fileId as string

    try {
        const file = await updateFileContent(fileId, parsed.data.content, req.userId)
        res.json({ file })
    } catch (error) {
        if (isNotFound(error)) {
            return res.status(404).json({ error: (error as Error).message })
        }
        res.status(500).json({ error: 'Something went wrong' })
    }
}
