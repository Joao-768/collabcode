import jwt from 'jsonwebtoken'
import { env } from './env.js'

export function tokenizeUser(user: { id: string }) {
    const payload = { id: user.id }
    const token = jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    })
    return token
}

export function verifyToken(token: string) {
    try {
        const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string }
        return decoded
    } catch (error) {
        return null
    }
}
