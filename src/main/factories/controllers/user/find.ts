import { FindUserController } from '@/application/controllers/user'
import { UserManager } from '@/data/protocols'

import { makeUserRepository } from '../../repositories'

export const makeFindUserController = (): FindUserController => {
  const userRepository = makeUserRepository()
  const userManagement = new UserManager(userRepository)

  return new FindUserController(userManagement)
}
