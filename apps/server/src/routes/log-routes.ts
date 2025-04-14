import { Response, Router } from 'express'
import { asyncHandler } from '../lib/errorHandler'
import { requireAuth } from '../middleware/auth'
import { getLogs } from '../services/log/log.service.queries'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const logs = await getLogs()

    res.json(logs)
  }),
)

export default router
