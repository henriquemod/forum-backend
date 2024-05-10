import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeCreatePostController,
  makeFindAllPostController
} from '../factories/controllers/post'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post(
    '/post/create',
    auth,
    adaptExpressRoute(makeCreatePostController())
  )
  router.get('/posts', auth, adaptExpressRoute(makeFindAllPostController()))
}
