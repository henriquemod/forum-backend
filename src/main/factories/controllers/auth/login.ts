import { LoginController } from '@/application/controllers/auth'
import { DbAddToken } from '@/data/usecases/db-add-token'
import { DBFindUserByEmail } from '@/data/usecases/user'
import {
  TokenMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'

export const makeLoginController = (): LoginController => {
  const tokenRepo = new TokenMongoRepository()
  const findYserByUsername = new DBFindUserByEmail(new UserMongoRepository())
  return new LoginController(
    new UserMongoRepository(),
    new DbAddToken(findYserByUsername, tokenRepo)
  )
}
