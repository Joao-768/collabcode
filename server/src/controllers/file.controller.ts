import type { RequestHandler } from 'express'
import { z } from 'zod'
import * as fileService from '../services/file.service.js'
import { SUPPORTED_LANGUAGES } from '../services/file.service.js'

const fileNameSchema = z
    .string()
    .min(1)
    .max(120)
    .regex(/^[\w.-]+$/, 'Only letters, numbers, dots, dashes and underscores are allowed')

export const createFileSchema = z.object({
    name: fileNameSchema,
    language: z.enum(SUPPORTED_LANGUAGES).default('javascript'),
})

export const renameFileSchema = z.object({
    name: fileNameSchema,
})

export const list: RequestHandler = async (req, res) => {
    const files = await fileService.listFiles(req.params.id as string, req.user!.id)
    res.json({ files })
}

export const create: RequestHandler = async (req, res) => {
    const { name, language } = req.body as z.infer<typeof createFileSchema>
    const file = await fileService.createFile(req.params.id as string, req.user!.id, name, language)
    res.status(201).json({ file })
}

export const get: RequestHandler = async (req, res) => {
    const file = await fileService.getFile(req.params.fileId as string, req.user!.id)
    res.json({ file })
}

export const rename: RequestHandler = async (req, res) => {
    const { name } = req.body as z.infer<typeof renameFileSchema>
    const file = await fileService.renameFile(req.params.fileId as string, req.user!.id, name)
    res.json({ file })
}

export const remove: RequestHandler = async (req, res) => {
    await fileService.deleteFile(req.params.fileId as string, req.user!.id)
    res.status(204).end()
}
