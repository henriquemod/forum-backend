import type { Token } from '@/data/protocols/db'
import type { Token as TokenModel, User } from '@/domain/models'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class JWTEncryption
  implements Token.Validate, Token.SignIn, Token.Refresh, Token.Invalidate
{
  constructor(private readonly tokenRepository: Token.Invalidate) {}

  async invalidate(accessToken: string): Promise<void> {
    await this.tokenRepository.invalidate(accessToken)
  }

  async refresh(accessToken: string): Promise<Token.RefreshResult> {
    throw new Error('Method not implemented.')
  }

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

  async signIn(user: User): Promise<Omit<TokenModel, 'invalid'>> {
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      env.jwtSecret,
      { expiresIn: '3h' }
    )

    const refreshToken = jwt.sign(
      { id: user.id, username: user.username },
      env.refreshTokenSecret,
      { expiresIn: '3d' }
    )

    return {
      accessToken,
      refreshAccessToken: refreshToken,
      user
    }
  }
}
