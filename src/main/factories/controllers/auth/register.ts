import { RegisterController } from '@/application/controllers/auth'
import { UserManager } from '@/data/protocols'
import { UserMongoRepository } from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'

export const makeRegisterController = (): RegisterController => {
  const bCryptHashInfra = new BCryptHash()
  const userMongoRepository = new UserMongoRepository(bCryptHashInfra)
  const userManager = new UserManager(userMongoRepository)

  return new RegisterController(userManager)
}
