import type { ClientSession } from 'mongoose'

import { ActivateUserController } from '@/application/controllers/auth'
import { ActivationManager, UserManager } from '@/data/protocols'
import { ActivationMongoRepository } from '@/infra/db/mongodb/repos'

import { makeUserRepository } from '../../repositories'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeActivateUserController = (
  session?: ClientSession
): ActivateUserController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = makeUserRepository(session)
  const userManagement = new UserManager(userRepository)
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(session)
  )

  return new ActivateUserController(
    userManagement,
    activationManager,
    mongoSession
  )
}
