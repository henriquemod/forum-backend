import { Controller, ok, type HttpResponse } from '@/application/protocols'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { RefreshToken } from '@/data/usecases/token'

export class RefreshTokenController extends Controller {
  constructor(private readonly refreshTokenService: RefreshToken) {
    super()
  }

  async perform({ accessToken }: { accessToken: string }): Promise<
    HttpResponse<{
      accessToken: string
    }>
  > {
    const res = await this.refreshTokenService.refresh(accessToken)
    return ok({
      accessToken: res.accessToken
    })
  }

  override buildValidators({
    accessToken
  }: {
    accessToken: string
  }): Validator[] {
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
