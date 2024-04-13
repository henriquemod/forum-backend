import { LoginController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash, JWTEncryption } from '@/infra/encryption'

export const makeLoginController = (): LoginController => {
  const hash = new BCryptHash()
  const userRepository = new UserMongoRepository(hash)
  const tokenRepo = new TokenMongoRepository()
  return new LoginController(
    userRepository,
    new TokenManager(tokenRepo, userRepository, new JWTEncryption(tokenRepo)),
    hash
  )
}
