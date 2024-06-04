import { DeleteUserController } from '@/application/controllers/user'
import { UserManager } from '@/data/protocols'

import { makeUserRepository } from '../../repositories'

export const makeDeleteUserController = (): DeleteUserController => {
  const userRepository = makeUserRepository()
  const userManagement = new UserManager(userRepository)

  return new DeleteUserController(userManagement)
}
