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
  return new LogoutController(
    new TokenManager(
      tokenRepository,
      userRepository,
      new TokenManager(
        tokenRepository,
        userRepository,
        new JWTEncryption(tokenRepository)
      )
    )
  )
}
