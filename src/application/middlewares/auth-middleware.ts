import type { Request } from 'express'
import { BadRequest, Forbidden } from '../errors'
import {
  badRequest,
  noContent,
  unauthorized,
  type Middleware
} from '../protocols'
import { ApiError } from '../protocols/api-error'
import type { HttpResponse } from '../protocols/http/responses'
import type { Token } from '@/data/usecases'

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

      const user = await this.tokenValidator.getUser(token)

      if (!user) {
        return unauthorized(new Forbidden())
      }

      req = { ...req, body: { ...req.body, user } }

      return noContent()
    } catch (error) {
      return ApiError.errorHandler(error)
    }
  }
}
