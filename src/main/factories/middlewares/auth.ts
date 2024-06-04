import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenManager } from '@/data/protocols/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'
import { JwtTokenEncryption } from '@/infra/encryption'

export const makeAuthMiddleware = (): Middleware => {
  const tokenRepository = new TokenMongoRepository()
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const tokenValidator = new TokenManager(tokenRepository, jwtManager)

  return new AuthMiddleware(tokenValidator)
}
