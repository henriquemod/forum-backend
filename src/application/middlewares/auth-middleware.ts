import type { Token } from '@/data/usecases'
import type { Request } from 'express'
import { BadRequest, Forbidden } from '../errors'
import { badRequest, ok, unauthorized, type Middleware } from '../protocols'
import { ApiError } from '../protocols/api-error'
import type { HttpResponse } from '../protocols/http/responses'

type TokenManager = Token.Validate & Token.GetUser

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenValidator: TokenManager) {}
  async handle(req: Partial<Request>): Promise<HttpResponse> {
    try {
      if (!req.headers?.authorization) {
        return unauthorized(new Forbidden())
      }

      const token = req.headers.authorization.split(' ')[1] // Bearer TOKEN

      if (!token) {
        return badRequest(new BadRequest('Malformed token'))
      }

      const authenticated = await this.tokenValidator.validate(token)

      if (!authenticated) {
        return unauthorized(new Forbidden())
      }

      const userId = await this.tokenValidator.getUser(token)

      if (!userId) {
        return unauthorized(new Forbidden())
      }

      return ok({ userId })
    } catch (error) {
      return ApiError.errorHandler(error)
    }
  }
}
