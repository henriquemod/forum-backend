import {
  Controller,
  noContent,
  type HttpResponse
} from '@/application/protocols'
import type { Token } from '@/data/protocols/db/token'
import type { Logout } from '@/domain/usecases/auth'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LogoutController extends Controller {
  constructor(private readonly tokenRepository: Token.Find & Token.Invalidate) {
    super()
  }

  async perform({ accessToken }: Logout.Params): Promise<HttpResponse<void>> {
    const token = await this.tokenRepository.findByToken(accessToken)

    if (!token) {
      throw new Error('Invalid access token')
    }

    await this.tokenRepository.invalidate(token.accessToken)

    return noContent()
  }

  override buildValidators({ accessToken }: Logout.Params): Validator[] {
    return [
      ...builder
        .of({
          value: accessToken,
          fieldName: 'accessToken'
        })
        .required()
        .build()
    ]
  }
}
