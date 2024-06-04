import { FindAuthenticatedUserController } from '@/application/controllers/user'
import { UserManager } from '@/data/protocols'

import { makeUserRepository } from '../../repositories'

export const makeFindAuthenticatedUserController =
  (): FindAuthenticatedUserController => {
    const userRepository = makeUserRepository()
    const userManagement = new UserManager(userRepository)

    return new FindAuthenticatedUserController(userManagement)
  }
