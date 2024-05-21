import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import type { ClientSession } from 'mongoose'
import {
  makeCreatePostController,
  makeDeletePostController,
  makeFindAllPostController,
  makeFindPostController,
  makeUpdatePostController
} from '../factories/controllers/post'
import { auth } from '../middlewares'

export default (router: Router, session: ClientSession): void => {
  router.post(
    '/post',
    auth,
    adaptExpressRoute(makeCreatePostController(session))
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
