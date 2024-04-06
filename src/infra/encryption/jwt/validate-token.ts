import { UnauthorizedError } from '@/application/errors'
import type { JWTTokenValidator, RefreshToken } from '@/data/usecases/token'
import { env } from '@/main/config/env'
import jwt from 'jsonwebtoken'

export class TokenValidator implements JWTTokenValidator, RefreshToken {
  async validate(token: string): Promise<boolean> {
    return await new Promise((resolve) => {
      jwt.verify(token, env.jwtSecret, (err) => {
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
