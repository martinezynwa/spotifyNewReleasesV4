import { Request, Response, Router } from 'express'

import { asyncHandler, sendNotFound } from '../lib/errorHandler'
import { requireAuth } from '../middleware/auth'
import * as usersService from '../services/user/user.service'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const users = await usersService.getAllUsers()
    res.json(users)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await usersService.getUserById(req.params.id)
    if (!user) {
      return sendNotFound(res, 'User not found')
    }
    res.json(user)
  }),
)

export default router
