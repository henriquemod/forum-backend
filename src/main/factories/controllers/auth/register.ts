import { RegisterController } from '@/application/controllers/auth'
import { ActivationManager, UserManager } from '@/data/protocols'
import {
  ActivationMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import { MailjetMailService } from '@/infra/mail'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeRegisterController = (
  session: ClientSession
): RegisterController => {
  const bCryptHashInfra = new BCryptHash()
  const mongoSession = mongoSessionFactory(session)
  const userMongoRepository = new UserMongoRepository(bCryptHashInfra, session)
  const userManager = new UserManager(userMongoRepository)
  const mailService = new MailjetMailService()
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(),
    userMongoRepository
  )

  return new RegisterController(
    userManager,
    activationManager,
    mailService,
    mongoSession
  )
}
