import { LoginController } from '@/application/controllers/auth'
import { TokenManager, UserManager } from '@/data/protocols'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JwtTokenEncryption } from '@/infra/encryption'

export const makeLoginController = (): LoginController => {
  const hash = new BCryptHash()
  const userRepository = new UserMongoRepository(hash)
  const tokenRepository = new TokenMongoRepository()
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const userManagement = new UserManager(userRepository)
  const tokenManager = new TokenManager(
    tokenRepository,
    userRepository,
    jwtManager
  )

  return new LoginController(userManagement, tokenManager, hash)
}
