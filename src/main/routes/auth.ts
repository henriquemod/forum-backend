import { adaptExpressRoute } from '@/main/adapters'
import type { Router } from 'express'
import {
  makeLoginController,
  makeRefreshTokenController
} from '../factories/controllers/auth'
import { makeRegisterController } from '../factories/controllers/auth/register'
import { auth } from '../middlewares'

let refreshTokens: string[] = []

export default (router: Router): void => {
  router.post('/login', adaptExpressRoute(makeLoginController()))
  router.post('/token', adaptExpressRoute(makeRefreshTokenController()))
  router.post('/register', adaptExpressRoute(makeRegisterController()))

  router.get('/protected', auth, (req, res) => {
    res.json({
      message: "You're authorized to access this route",
      user: req.user
    })
  })

  router.delete('/logout', (req, res) => {
    // Remove the submitted token from the array of stored refresh tokens
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
    res.sendStatus(204) // No Content
  })
}
