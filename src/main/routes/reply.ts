import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import type { ClientSession } from 'mongoose'
import {
  makeCreateReplyController,
  makeDeleteReplyController,
  makeFindReplyController,
  makeUpdateReplyController
} from '../factories/controllers/reply'
import { auth } from '../middlewares'

export default (router: Router, session: ClientSession): void => {
  router.post(
    '/reply',
    auth,
    adaptExpressRoute(makeCreateReplyController(session))
  )
  router.put(
    '/reply',
    auth,
    adaptExpressRoute(makeUpdateReplyController(session))
  )
  router.get('/reply/:replyId', adaptExpressRoute(makeFindReplyController()))
  router.delete(
    '/reply',
    auth,
    adaptExpressRoute(makeDeleteReplyController(session))
  )
}
