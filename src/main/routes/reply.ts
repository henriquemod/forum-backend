import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import type { ClientSession } from 'mongoose'
import { makeCreateReplyController } from '../factories/controllers/reply'
import { auth } from '../middlewares'

export default (router: Router, session: ClientSession): void => {
  router.post(
    '/reply',
    auth,
    adaptExpressRoute(makeCreateReplyController(session))
  )
}
