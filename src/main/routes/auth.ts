// import { adaptExpressRoute } from '@/infra/http/express-router'
// import { makeFacebookLoginController } from '@/main/factories/controllers'
import type { Router, Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '@/main/config/env'
// import type { DataSource } from 'typeorm'

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

// Mock user for demonstration
const users = [
  {
    id: 1,
    username: 'user1',
    password: 'pass1' // Note: in a real application, passwords should be hashed!
  }
]
let refreshTokens: string[] = []

export default (router: Router): void => {
  router.post('/login', (req, res) => {
    const { username, password } = req.body
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      // Access token is short-lived
      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        env.jwtSecret,
        { expiresIn: '20s' }
      )

      // Refresh token is long-lived
      const refreshToken = jwt.sign(
        { id: user.id, username: user.username },
        env.refreshTokenSecret,
        { expiresIn: '7d' }
      )

      // Ideally, store the refresh token in a database or a secure place
      // For this example, let's store it in-memory. In production, you should use a database.
      refreshTokens.push(refreshToken)

      return res.json({ accessToken, refreshToken })
    } else {
      return res.status(401).send('Username or password is incorrect')
    }
  })

  router.get('/protected', authenticateToken, (req, res) => {
    res.json({
      message: "You're authorized to access this route",
      user: req.user
    })
  })

  router.post('/token', (req, res) => {
    const token = (req.body.token as string) || null

    if (token == null) return res.sendStatus(401)
    if (!refreshTokens.includes(token)) return res.sendStatus(403)

    jwt.verify(token, env.refreshTokenSecret, (err, user) => {
      if (err || !user || typeof user === 'string') return res.sendStatus(403)

      const accessToken = jwt.sign(
        { id: user.id, username: user.username },
        env.jwtSecret,
        { expiresIn: '20s' }
      )

      res.json({ accessToken })
    })
  })

  router.delete('/logout', (req, res) => {
    // Remove the submitted token from the array of stored refresh tokens
    refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
    res.sendStatus(204) // No Content
  })
}
