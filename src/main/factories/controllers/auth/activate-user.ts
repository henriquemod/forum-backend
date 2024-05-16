import { ActivateUserController } from '@/application/controllers/auth'
import { ActivationManager, UserManager } from '@/data/protocols'
import {
  ActivationMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeActivateUserController = (): ActivateUserController => {
  const userRepository = new UserMongoRepository(new BCryptHash())
  const userManagement = new UserManager(userRepository)
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(),
    userRepository
  )

  return new ActivateUserController(userManagement, activationManager)
}
