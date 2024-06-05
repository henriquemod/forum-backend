import type { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import type { ExtraParams } from '../config/routes'
import {
  makeCreateUserController,
  makeDeleteUserController,
  makeFindAuthenticatedUserController,
  makeFindUserController
} from '../factories/controllers/user'
import { auth } from '../middlewares'

export default (router: Router, { session }: ExtraParams): void => {
  router.get('/user/:id', adaptExpressRoute(makeFindUserController()))
  router.post('/user', adaptExpressRoute(makeCreateUserController(session)))
  router.post(
    '/auth-user',
    auth,
    adaptExpressRoute(makeFindAuthenticatedUserController())
  )
  router.delete('/user', auth, adaptExpressRoute(makeDeleteUserController()))
}
