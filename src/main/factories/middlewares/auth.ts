import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JwtTokenEncryption } from '@/infra/encryption'

export const makeAuthMiddleware = (): Middleware => {
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(new BCryptHash())
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const tokenValidator = new TokenManager(
    tokenRepository,
    userRepository,
    jwtManager
  )
  return new AuthMiddleware(tokenValidator)
}
