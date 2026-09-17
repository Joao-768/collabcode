import { z } from 'zod'

export const createFileSchema = z.object({
    name: z.string().min(1, 'File name is required').max(100, 'File name is too long'),
})

export const updateFileSchema = z.object({
    content: z.string(),
})
