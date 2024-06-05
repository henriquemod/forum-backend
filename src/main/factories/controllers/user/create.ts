import type { ClientSession } from 'mongoose'

import { CreateUserController } from '@/application/controllers/user'
import { ActivationManager, UserManager } from '@/data/protocols'
import { ActivationMongoRepository } from '@/infra/db/mongodb/repos'
import { MailjetMailService } from '@/infra/mail'

import { makeUserRepository } from '../../repositories'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeCreateUserController = (
  session?: ClientSession
): CreateUserController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = makeUserRepository(session)
  const userManager = new UserManager(userRepository)
  const mailService = new MailjetMailService()
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(session)
  )

  return new CreateUserController(
    userManager,
    activationManager,
    mailService,
    mongoSession
  )
}
