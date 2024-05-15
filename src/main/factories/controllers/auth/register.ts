import { RegisterController } from '@/application/controllers/auth'
import { ActivationManager, UserManager } from '@/data/protocols'
import {
  ActivationMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import { MailgunMailService } from '@/infra/mail/mailgun'

export const makeRegisterController = (): RegisterController => {
  const bCryptHashInfra = new BCryptHash()
  const userMongoRepository = new UserMongoRepository(bCryptHashInfra)
  const userManager = new UserManager(userMongoRepository)
  const mailService = new MailgunMailService()
  const activationManager = new ActivationManager(
    new ActivationMongoRepository(),
    userMongoRepository
  )

  return new RegisterController(userManager, activationManager, mailService)
}
