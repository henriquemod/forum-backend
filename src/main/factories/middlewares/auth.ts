import { AuthMiddleware } from '@/application/middlewares'
import type { Middleware } from '@/application/protocols'
import { TokenValidator } from '@/infra/encryption/jwt'

export const makeAuthMiddleware = (): Middleware => {
  const tokenValidator = new TokenValidator()
  return new AuthMiddleware(tokenValidator)
}
