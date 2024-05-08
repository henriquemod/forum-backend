import { LogoutController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JwtTokenEncryption } from '@/infra/encryption'

export const makeLogoutController = (): LogoutController => {
  const bCryptHash = new BCryptHash()
  const tokenRepository = new TokenMongoRepository()
  const userRepository = new UserMongoRepository(bCryptHash)
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const tokenManager = new TokenManager(
    tokenRepository,
    userRepository,
    jwtManager
  )

  return new LogoutController(tokenManager)
}
