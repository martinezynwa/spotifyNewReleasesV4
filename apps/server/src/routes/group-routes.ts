import { Request, Response, Router } from 'express'
import { asyncHandler, sendNotFound } from '../lib/errorHandler'
import { requireAuth } from '../middleware/auth'
import * as groupsService from '../services/group/group.service'

const router = Router()

router.use(requireAuth)

router.get(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const groups = await groupsService.getAllGroups()
    res.json(groups)
  }),
)

router.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const group = await groupsService.getGroupById(req.params.id)
    if (!group) {
      return sendNotFound(res, 'Group not found')
    }
    res.json(group)
  }),
)

router.post(
  '/',
  asyncHandler(async (req: Request, res: Response) => {
    const group = await groupsService.createGroup(req.body)
    res.status(201).json(group)
  }),
)

router.put(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const group = await groupsService.updateGroup(req.params.id, req.body)
    if (!group) {
      return sendNotFound(res, 'Group not found')
    }
    res.json(group)
  }),
)

router.delete(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const group = await groupsService.deleteGroup(req.params.id)
    if (!group) {
      return sendNotFound(res, 'Group not found')
    }
    res.json(group)
  }),
)

export default router
