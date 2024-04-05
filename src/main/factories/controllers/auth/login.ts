import { LoginController } from '@/application/controllers/auth'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'

export const makeLoginController = (): LoginController => {
  const userRepository = new UserMongoRepository()
  const tokenRepository = new TokenMongoRepository()
  return new LoginController(userRepository, tokenRepository)
}
