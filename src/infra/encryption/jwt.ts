import type { Token } from '@/data/usecases/token'
import type { UserModel } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

type TokenDBUsecases = DBToken.Delete & DBToken.FindTokenByUserId
type TokenDataUsecases = Token.SignIn & Token.Invalidate & Token.Validate

export class JwtTokenEncryption implements TokenDataUsecases {
  constructor(private readonly tokenRepository: TokenDBUsecases) {}

  async userHasToken(userId: string): Promise<boolean> {
    const token = await this.tokenRepository.findByUserId(userId)
    return !!token
  }

  async signIn(user: UserModel.Model): Promise<Token.SignResult> {
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
      userId: user.id
    }
  }

  async invalidate(accessToken: string): Promise<void> {
    await this.tokenRepository.delete(accessToken)
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
}
