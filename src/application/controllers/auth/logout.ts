import {
  badRequest,
  Controller,
  noContent,
  type HttpResponse
} from '@/application/protocols'
import type {
  FindTokenRepository,
  InvalidateTokenRepository
} from '@/data/protocols/db/token'
import type { Logout } from '@/domain/usecases/auth'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LogoutController extends Controller {
  constructor(
    private readonly tokenRepository: FindTokenRepository &
      InvalidateTokenRepository
  ) {
    super()
  }

  async perform({
    accessToken
  }: Logout.Params): Promise<HttpResponse<Logout.Result>> {
    const token = await this.tokenRepository.find({
      accessToken
    })

    if (!token) {
      return badRequest(new Error('Invalid access token'))
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
