import type { Token } from '@/data/usecases'
import type { Request } from 'express'
import { BadRequest, Forbidden } from '../errors'
import { badRequest, ok, unauthorized, type Middleware } from '../protocols'
import { ApiError } from '../protocols/api-error'
import type { HttpResponse } from '../protocols/http/responses'

type TokenManager = Token.Validate & Token.GetToken

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenManager: TokenManager) {}
  async handle(req: Partial<Request>): Promise<HttpResponse> {
    try {
      if (!req.headers?.authorization) {
        return unauthorized(new Forbidden())
      }

      const token = req.headers.authorization.split(' ')[1] // Bearer TOKEN

      if (!token) {
        return badRequest(new BadRequest('Malformed token'))
      }

      const userToken = await this.tokenManager.getToken(token)

      const authenticated = await this.tokenManager.validate(
        userToken.accessToken
      )

      if (!authenticated) {
        return unauthorized(new Forbidden())
      }

      return ok({ userId: userToken.user.id })
    } catch (error) {
      return ApiError.errorHandler(error)
    }
  }
}
