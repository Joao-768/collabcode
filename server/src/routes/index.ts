import { Router } from 'express'
import { authRoutes } from './auth.routes.js'
import { projectRoutes } from './project.routes.js'

export const apiRoutes = Router()

apiRoutes.use('/auth', authRoutes)

apiRoutes.use('/projects', projectRoutes)
