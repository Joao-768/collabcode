import { Router } from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import { get, update } from '../controllers/file.controller.js'

// Operations on one file by its own id. Listing and creating live on the
// project router, since those are about a project's files.
export const fileRouter = Router()

fileRouter.use(requireAuth)

fileRouter.get('/:fileId', get)
fileRouter.put('/:fileId', update)
