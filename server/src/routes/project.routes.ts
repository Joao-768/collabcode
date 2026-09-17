import { Router } from 'express'
import { create, list, remove } from '../controllers/project.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { list as listFiles, create as createFile } from '../controllers/file.controller.js'

export const projectRouter = Router()

projectRouter.use(requireAuth)

projectRouter.post('/', create)
projectRouter.get('/', list)
projectRouter.get('/:projectId/files', listFiles)
projectRouter.post('/:projectId/files', createFile)
projectRouter.delete('/:projectId', remove)
