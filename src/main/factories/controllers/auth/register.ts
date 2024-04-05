import { RegisterController } from '@/application/controllers/auth'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'

export const makeRegisterController = (): RegisterController => {
  return new RegisterController(new UserMongoRepository())
}
