import { UnauthorizedError } from '@/application/errors'
import type {
  TokenValidate,
  RefreshToken,
  FindTokenRepository
} from '@/data/protocols/db/token'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class TokenManager implements TokenValidate, RefreshToken {
  constructor(private readonly tokenRepository: FindTokenRepository) {}

  async validate(accessToken: string): Promise<boolean> {
    const userToken = await this.tokenRepository.find({ accessToken })

    if (!userToken) {
      return false
    }

    return await new Promise((resolve) => {
      jwt.verify(accessToken, env.jwtSecret, (err) => {
        if (err) {
          resolve(false)
        }
        resolve(true)
      })
    })
  }

  async refresh(
    accessToken: RefreshToken.Params
  ): Promise<RefreshToken.Result> {
    return await new Promise((resolve) => {
      jwt.verify(accessToken, env.refreshTokenSecret, (err, user) => {
        if (err || !user || typeof user === 'string')
          throw new UnauthorizedError()

        const accessToken = jwt.sign(
          { id: user.id, username: user.username },
          env.jwtSecret,
          { expiresIn: '20d' }
        )

        resolve({ accessToken })
      })
    })
  }
}
