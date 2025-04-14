import { Request, Response, Router } from 'express'
import { asyncHandler } from '../lib/errorHandler'
import { requireAuth } from '../middleware/auth'
import * as artistsService from '../services/artist/artist.service'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const artists = await artistsService.getAllArtists()
    res.json(artists)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const artist = await artistsService.getArtistById(req.params.id)
    res.json(artist)
  }),
)

export default router
