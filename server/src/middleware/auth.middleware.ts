import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../lib/jwt.js'

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    req.userId = decoded.id
    next()
}
