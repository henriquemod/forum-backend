import { FindUserController } from '@/application/controllers/user'
import { UserManager } from '@/data/protocols'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeFindUserController = (): FindUserController => {
  const userRepository = new UserMongoRepository(new BCryptHash())
  const userManagement = new UserManager(userRepository)

  return new FindUserController(userManagement)
}
