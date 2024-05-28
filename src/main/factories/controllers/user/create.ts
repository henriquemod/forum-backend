import { CreateUserController } from '@/application/controllers/user'
import { ActivationManager, UserManager } from '@/data/protocols'
import {
  ActivationMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import { MailjetMailService } from '@/infra/mail'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeCreateUserController = (
  session: ClientSession
): CreateUserController => {
  const bCryptHashInfra = new BCryptHash()
  const mongoSession = mongoSessionFactory(session)
  const userMongoRepository = new UserMongoRepository(bCryptHashInfra, session)
  const userManager = new UserManager(userMongoRepository)
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
