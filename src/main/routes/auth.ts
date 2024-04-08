import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
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
  router.post('/logout', auth, adaptExpressRoute(makeLogoutController()))

  router.get('/protected', auth, (req, res) => {
    res.json({
      message: "You're authorized to access this route",
      user: req.user
    })
  })
}
