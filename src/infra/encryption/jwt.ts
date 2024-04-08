import type {
  RefreshTokenValidate,
  SignInToken,
  TokenValidate
} from '@/data/protocols/db/token'
import type { Token, User } from '@/domain/models'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class JWTEncryption
  implements TokenValidate, SignInToken, RefreshTokenValidate
{
  async validate(accessToken: string): Promise<boolean> {
    return await new Promise((resolve) => {
      jwt.verify(accessToken, env.jwtSecret, (err) => {
        if (err) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  async validateRefreshToken(accessRefreshToken: string): Promise<boolean> {
    return await new Promise((resolve) => {
      jwt.verify(accessRefreshToken, env.refreshTokenSecret, (err) => {
        if (err) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  async signIn(user: User): Promise<Omit<Token, 'invalid'>> {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: '20d' }
    )

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      env.refreshTokenSecret,
      { expiresIn: '30d' }
    )

    return {
      accessToken,
      refreshAccessToken: refreshToken,
      user
    }
  }
}
