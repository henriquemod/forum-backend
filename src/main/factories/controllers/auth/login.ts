import { LoginController } from '@/application/controllers/auth'
import { LoginService } from '@/data/services'
import { TokenMongoRepository } from '@/infra/db/mongodb'
// import type { DataSource } from 'typeorm'

export const makeLoginController = (): LoginController => {
  const service = new LoginService()
  const mongoRepository = new TokenMongoRepository()
  return new LoginController(service, mongoRepository)
}
