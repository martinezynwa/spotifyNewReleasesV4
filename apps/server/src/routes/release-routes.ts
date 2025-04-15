import { Request, Response, Router } from 'express'
import { asyncHandler } from '../lib/errorHandler'
import { requireAuth } from '../middleware/auth'
import * as jobService from '../services/job/job.service'
import * as releasesService from '../services/release/release.service'
import { RequestProps } from '../types/types'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const releases = await releasesService.getAllReleases()
    res.json(releases)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const release = await releasesService.getReleaseById(req.params.id)
    res.json(release)
  }),
)

router.post(
  '/manual-fetch',
  asyncHandler(
    async (
      req: RequestProps<{
        dayLimit: number
      }>,
      res: Response,
    ) => {
      const result = await jobService.nightlyJob({
        dayLimit: req.body.dayLimit,
      })

      res.json(result)
    },
  ),
)

export default router
