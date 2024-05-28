import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeActivateUserController,
  makeLoginController,
  makeLogoutController,
  makeRefreshTokenController
} from '../factories/controllers/auth'
import { auth } from '../middlewares'
import type { ClientSession } from 'mongoose'

export default (router: Router, session: ClientSession): void => {
  router.post('/login', adaptExpressRoute(makeLoginController(session)))
  router.post('/token', adaptExpressRoute(makeRefreshTokenController(session)))
  router.post(
    '/activate-user',
    adaptExpressRoute(makeActivateUserController(session))
  )
  router.post('/logout', auth, adaptExpressRoute(makeLogoutController(session)))
}
