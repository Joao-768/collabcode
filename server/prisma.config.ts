import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

// In Prisma 7 the connection URL lives here instead of in schema.prisma.
// The CLI reads this file for migrate/generate; the runtime client gets its
// connection separately through the PrismaPg driver adapter (src/lib/prisma.ts).
export default defineConfig({
    schema: 'prisma/schema.prisma',
    migrations: {
        path: 'prisma/migrations',
    },
    datasource: {
        url: env('DATABASE_URL'),
    },
})
