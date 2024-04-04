import { UnauthorizedError } from '@/application/errors'
import type { RefreshToken } from '@/domain/features'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

// Mock user for demonstration
const refreshTokens: string[] = []

export class RefreshTokenService implements RefreshToken {
  async perform(params: RefreshToken.Params): Promise<RefreshToken.Result> {
    const { accessToken } = params

    if (accessToken == null) return new UnauthorizedError()
    if (!refreshTokens.includes(accessToken)) return new UnauthorizedError()
    return await new Promise(() => {
      jwt.verify(accessToken, env.refreshTokenSecret, (err, user) => {
        if (err || !user || typeof user === 'string')
          return new UnauthorizedError()

        const accessToken = jwt.sign(
          { id: user.id, username: user.username },
          env.jwtSecret,
          { expiresIn: '20s' }
        )

        return { accessToken }
      })
    })
  }
}
