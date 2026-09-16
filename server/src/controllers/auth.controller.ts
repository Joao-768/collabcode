import registerUser from '../services/auth.service.js'
import { registerSchema } from '../schemas/auth.schema.js'
import type { Request, Response } from 'express'

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.issues })
    }

    const { name, email, password } = parsed.data

    try {
        const user = await registerUser(name, email, password)
        res.status(201).json({ user })
    } catch (error) {
        if (error instanceof Error && error.message === 'User already exists') {
            return res.status(409).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
}
