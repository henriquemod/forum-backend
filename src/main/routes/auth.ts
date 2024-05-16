import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeActivateUserController,
  makeLoginController,
  makeLogoutController,
  makeRefreshTokenController,
  makeRegisterController
} from '../factories/controllers/auth'
import { auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/login', adaptExpressRoute(makeLoginController()))
  router.post('/token', adaptExpressRoute(makeRefreshTokenController()))
  router.post('/register', adaptExpressRoute(makeRegisterController()))
  router.post('/activate-user', adaptExpressRoute(makeActivateUserController()))
  router.post('/logout', auth, adaptExpressRoute(makeLogoutController()))
}
