import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenManager } from '@/data/usecases/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'
import { JWTEncryption } from '@/infra/encryption'

export const makeAuthMiddleware = (): Middleware => {
  const tokenValidator = new TokenManager(
    new TokenMongoRepository(),
    new JWTEncryption()
  )
  return new AuthMiddleware(tokenValidator)
}
