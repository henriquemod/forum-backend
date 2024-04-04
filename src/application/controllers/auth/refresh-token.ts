import { Controller } from '@/application/controllers'
import { ok, unauthorized, type HttpResponse } from '@/application/helpers'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { RefreshToken } from '@/domain/features'

export class RefreshTokenController extends Controller {
  constructor(private readonly refreshTokenService: RefreshToken) {
    super()
  }

  async perform({
    accessToken
  }: RefreshToken.Params): Promise<HttpResponse<RefreshToken.Result>> {
    const res = await this.refreshTokenService.perform({
      accessToken
    })
    return res instanceof Error
      ? unauthorized()
      : ok({
          accessToken: res.accessToken
        })
  }

  override buildValidators({ accessToken }: RefreshToken.Params): Validator[] {
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
