import { Router } from 'express'
import { create, list, remove } from '../controllers/project.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

export const projectRouter = Router()

projectRouter.use(requireAuth)

projectRouter.post('/', create)
projectRouter.get('/', list)
projectRouter.delete('/:projectId', remove)
