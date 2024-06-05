import type { Router } from 'express'

import { adaptExpressRoute } from '@/main/adapters'

import type { ExtraParams } from '../config/routes'
import {
  makeActivateUserController,
  makeLoginController,
  makeLogoutController,
  makeRefreshTokenController
} from '../factories/controllers/auth'
import { auth } from '../middlewares'

export default (router: Router, { session }: ExtraParams): void => {
  router.post('/login', adaptExpressRoute(makeLoginController(session)))
  router.post('/token', adaptExpressRoute(makeRefreshTokenController(session)))
  router.post(
    '/activate-user',
    adaptExpressRoute(makeActivateUserController(session))
  )
  router.post('/logout', auth, adaptExpressRoute(makeLogoutController(session)))
}
