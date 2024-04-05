import type { Middleware } from '@/application/helpers'
import { AuthMiddleware } from '@/application/middlewares'

export const makeAuthMiddleware = (): Middleware => {
  return new AuthMiddleware()
}
