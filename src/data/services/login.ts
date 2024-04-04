import { AuthenticationError } from '@/domain/errors'
import type { Login } from '@/domain/features'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

// Mock user for demonstration
const users = [
  {
    id: 1,
    username: 'user1',
    password: 'pass1' // Note: in a real application, passwords should be hashed!
  }
]
const refreshTokens: string[] = []

export class LoginService implements Login {
  async perform(params: Login.Params): Promise<Login.Result> {
    const { username, password } = params
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      // Access token is short-lived
      const token = jwt.sign(
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

      return {
        token,
        refreshToken
      }
    } else {
      return new AuthenticationError()
    }
  }
}
