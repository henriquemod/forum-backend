import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JWTEncryption } from '@/infra/encryption'

export const makeAuthMiddleware = (): Middleware => {
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const tokenValidator = new TokenManager(
    tokenRepository,
    userRepository,
    new JWTEncryption(tokenRepository)
  )
  return new AuthMiddleware(tokenValidator)
}
