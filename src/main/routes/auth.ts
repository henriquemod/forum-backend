import { adaptExpressRoute } from '@/infra/http/express-router'
import { env } from '@/main/config/env'
import type { NextFunction, Request, Response, Router } from 'express'
import jwt from 'jsonwebtoken'
import {
  makeLoginController,
  makeRefreshTokenController
} from '../factories/controllers/auth'

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, env.jwtSecret, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}
let refreshTokens: string[] = []

export default (router: Router): void => {
  router.post('/login', adaptExpressRoute(makeLoginController()))
  router.post('/token', adaptExpressRoute(makeRefreshTokenController()))

  router.get('/protected', authenticateToken, (req, res) => {
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
