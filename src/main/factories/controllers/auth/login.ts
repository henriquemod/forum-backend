import { LoginController } from '@/application/controllers/auth'
import { DbAddToken } from '@/data/usecases/db/token'
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
    new DbAddToken(userRepository, tokenRepo),
    new JWTEncryption(tokenRepo),
    hash
  )
}
