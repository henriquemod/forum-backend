import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeCreatePostController,
  makeDeletePostController,
  makeFindAllPostController,
  makeFindPostController,
  makeUpdatePostController
} from '../factories/controllers/post'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/post', auth, adaptExpressRoute(makeCreatePostController()))
  router.put('/post', auth, adaptExpressRoute(makeUpdatePostController()))
  router.delete('/post', auth, adaptExpressRoute(makeDeletePostController()))
  router.get('/posts', auth, adaptExpressRoute(makeFindAllPostController()))
  router.get('/post', auth, adaptExpressRoute(makeFindPostController()))
}
