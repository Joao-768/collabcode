import { getUserById, loginUser, registerUser } from '../services/auth.service.js'
import { loginSchema, registerSchema } from '../schemas/auth.schema.js'
import type { Request, Response } from 'express'
import { tokenizeUser } from '../lib/jwt.js'
import { env } from '../lib/env.js'

export async function register(req: Request, res: Response) {
    const parsed = registerSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.issues })
    }

    const { name, email, password } = parsed.data

    try {
        const user = await registerUser(name, email, password)
        const token = tokenizeUser(user)
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.status(201).json({ user })
    } catch (error) {
        if (error instanceof Error && error.message === 'User already exists') {
            return res.status(409).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function login(req: Request, res: Response) {
    const parsed = loginSchema.safeParse(req.body)

    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.issues })
    }

    const { email, password } = parsed.data

    try {
        const user = await loginUser(email, password)
        const token = tokenizeUser(user)
        res.cookie('token', token, {
            httpOnly: true,
            secure: env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        res.json({ user })
    } catch (error) {
        if (error instanceof Error && error.message === 'Invalid email or password') {
            return res.status(401).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export async function me(req: Request, res: Response) {
    const userId = req.userId

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    try {
        const user = await getUserById(userId)
        res.json({ user })
    } catch (error) {
        if (error instanceof Error && error.message === 'User not found') {
            return res.status(404).json({ error: error.message })
        }
        return res.status(500).json({ error: 'Something went wrong' })
    }
}

export function logout(_req: Request, res: Response) {
    res.clearCookie('token', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'strict',
    })
    res.status(200).json({ message: 'Logged out successfully' })
}
