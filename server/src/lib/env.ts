import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    PORT: z.coerce.number().default(4000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(32),
    JWT_EXPIRES_IN: z.string().default('7d'),
    CLIENT_ORIGIN: z.url(),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
    console.error('Invalid environment variables:')
    console.error(z.prettifyError(parsed.error))
    process.exit(1)
}

export const env = parsed.data
