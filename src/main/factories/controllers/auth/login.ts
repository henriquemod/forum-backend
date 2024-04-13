import { LoginController } from '@/application/controllers/auth'
import { DbAddToken } from '@/data/usecases/db/token'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { JWTEncryption } from '@/infra/encryption'

export const makeLoginController = (): LoginController => {
  const userRepository = new UserMongoRepository()
  const tokenRepo = new TokenMongoRepository()
  return new LoginController(
    userRepository,
    new DbAddToken(userRepository, tokenRepo),
    new JWTEncryption(tokenRepo)
  )
}
