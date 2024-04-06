import type { Request } from 'express'
import type { TokenManager } from '@/data/usecases/token/validate-token'
import {
  noContent,
  unauthorized,
  type HttpResponse,
  type Middleware
} from '../protocols'

export class AuthMiddleware implements Middleware {
  constructor(private readonly tokenValidator: TokenManager) {}
  async handle({ authorization }: Request['headers']): Promise<HttpResponse> {
    if (!authorization) {
      return unauthorized()
    }

    const token = authorization.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return unauthorized()
    }

    const authenticated = await this.tokenValidator.validate(token)

    if (!authenticated) {
      return unauthorized()
    }

    return noContent()
  }
}
