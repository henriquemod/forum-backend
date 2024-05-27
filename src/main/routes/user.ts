import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeDeleteUserController,
  makeFindAuthenticatedUserController,
  makeFindUserController
} from '../factories/controllers/user'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.get('/user/:id', adaptExpressRoute(makeFindUserController()))
  router.delete('/user', auth, adaptExpressRoute(makeDeleteUserController()))
  router.post(
    '/auth-user',
    auth,
    adaptExpressRoute(makeFindAuthenticatedUserController())
  )
}
