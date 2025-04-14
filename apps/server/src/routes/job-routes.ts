import { Request, Response, Router } from 'express'
import { asyncHandler } from '../lib/errorHandler'
import { requireJobAuth } from '../middleware/jobAuth'

const router = Router()

router.use(requireJobAuth)

router.post(
  '/job',
  asyncHandler(async (req: Request, res: Response) => {
    res.json({ message: 'Ok' })
  }),
)

export default router
