import { LogoutController } from '@/application/controllers/auth'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'

export const makeLogoutController = (): LogoutController => {
  return new LogoutController(new TokenMongoRepository())
}
