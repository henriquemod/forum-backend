import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Token } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { Session } from '@/application/protocols/session'

type TokenManager = Token.Refresh

export class RefreshTokenController extends Controller {
  constructor(
    private readonly tokenManager: TokenManager,
    protected readonly session?: Session
  ) {
    super(session)
  }

  async perform({ accessToken }: { accessToken: string }): Promise<
    HttpResponse<{
      accessToken: string
    }>
  > {
    const res = await this.tokenManager.refresh(accessToken)
    return ok({
      accessToken: res.accessToken,
      accessRefreshToken: res.accessRefreshToken
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
