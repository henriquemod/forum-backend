import type { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import type { ExtraParams } from '../config/routes'
import {
  makeCreatePostController,
  makeDeletePostController,
  makeFindAllPostController,
  makeFindPostController,
  makeUpdatePostController
} from '../factories/controllers/post'
import { auth } from '../middlewares'

export default (router: Router, params: ExtraParams): void => {
  const { session, queueConnection } = params
  router.post(
    '/post',
    auth,
    adaptExpressRoute(makeCreatePostController({ session, queueConnection }))
  )
  router.put(
    '/post',
    auth,
    adaptExpressRoute(makeUpdatePostController(session))
  )
  router.delete(
    '/post',
    auth,
    adaptExpressRoute(makeDeletePostController(session))
  )
  router.get('/posts', auth, adaptExpressRoute(makeFindAllPostController()))
  router.get('/post', auth, adaptExpressRoute(makeFindPostController()))
}
