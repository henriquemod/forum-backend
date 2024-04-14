import { LogoutController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JWTEncryption } from '@/infra/encryption'

export const makeLogoutController = (): LogoutController => {
  const bCryptHash = new BCryptHash()
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(bCryptHash)
  const jwtManager = new JWTEncryption(tokenRepository)
  const tokenManager = new TokenManager(
    tokenRepository,
    userRepository,
    jwtManager
  )

  return new LogoutController(tokenManager)
}
