import express from 'express'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

dotenv.config()

const app = express()
const PORT = process.env.PORT ?? 3000

app.use(bodyParser.json())

const authenticateToken = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, JWT_SECRET, (err, user) => {
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

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET ?? 'your_access_token_secret'
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET ?? 'your_refresh_token_secret'
let refreshTokens: string[] = []

app.post('/login', (req, res) => {
  const { username, password } = req.body
  const user = users.find(
    (u) => u.username === username && u.password === password
  )

  if (user) {
    // Access token is short-lived
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '20s' }
    )

    // Refresh token is long-lived
    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      REFRESH_TOKEN_SECRET,
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

app.get('/protected', authenticateToken, (req, res) => {
  res.json({
    message: "You're authorized to access this route",
    user: req.user
  })
})

app.post('/token', (req, res) => {
  const token = (req.body.token as string) || null

  if (token == null) return res.sendStatus(401)
  if (!refreshTokens.includes(token)) return res.sendStatus(403)

  jwt.verify(token, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err || !user || typeof user === 'string') return res.sendStatus(403)

    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '20s' }
    )

    res.json({ accessToken })
  })
})

app.delete('/logout', (req, res) => {
  // Remove the submitted token from the array of stored refresh tokens
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token)
  res.sendStatus(204) // No Content
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

// Export app for testing purposes
export default app
