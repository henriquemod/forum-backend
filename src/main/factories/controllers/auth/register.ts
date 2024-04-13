import { RegisterController } from '@/application/controllers/auth'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeRegisterController = (): RegisterController => {
  return new RegisterController(new UserMongoRepository(new BCryptHash()))
}
