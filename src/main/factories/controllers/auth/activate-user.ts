import { ActivateUserController } from '@/application/controllers/auth'
import { ActivationManager, UserManager } from '@/data/protocols'
import {
  ActivationMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeActivateUserController = (
  session: ClientSession
): ActivateUserController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = new UserMongoRepository(new BCryptHash(), session)
  const userManagement = new UserManager(userRepository)
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(session),
    userRepository
  )

  return new ActivateUserController(
    userManagement,
    activationManager,
    mongoSession
  )
}
