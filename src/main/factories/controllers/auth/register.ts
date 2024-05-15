import { RegisterController } from '@/application/controllers/auth'
import { UserManager } from '@/data/protocols'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import { MailgunMailService } from '@/infra/mail/mailgun'

export const makeRegisterController = (): RegisterController => {
  const bCryptHashInfra = new BCryptHash()
  const userMongoRepository = new UserMongoRepository(bCryptHashInfra)
  const userManager = new UserManager(userMongoRepository)
  const mailService = new MailgunMailService()

  return new RegisterController(userManager, mailService)
}
