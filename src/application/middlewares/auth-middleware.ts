import type { TokenManager } from '@/data/usecases/token'
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

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenValidator: TokenManager) {}
  async handle({ authorization }: Request['headers']): Promise<HttpResponse> {
    try {
      if (!authorization) {
        return unauthorized(new Forbidden())
      }

      const token = authorization.split(' ')[1] // Bearer TOKEN

      if (!token) {
        return badRequest(new BadRequest('Malformed token'))
      }

      const authenticated = await this.tokenValidator.validate(token)

      if (!authenticated) {
        return unauthorized(new Forbidden())
      }

      return noContent()
    } catch (error) {
      return ApiError.errorHandler(error)
    }
  }
}
