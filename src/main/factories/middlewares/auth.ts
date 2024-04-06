import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenManager } from '@/data/usecases/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'

export const makeAuthMiddleware = (): Middleware => {
  const tokenValidator = new TokenManager(new TokenMongoRepository())
  return new AuthMiddleware(tokenValidator)
}
