import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { Authentication } from '@/data/usecases'
import type { Token } from '@/data/usecases/token'

import { ValidationBuilder as builder, type Validator } from '../../validation'

type TokenManager = Token.Invalidate

export class LogoutController extends Controller {
  constructor(
    private readonly tokenManager: TokenManager,
    protected readonly session?: Session
  ) {
    super({ session })
  }

  async perform({
    accessToken
  }: Authentication.LogoutParams): Promise<HttpResponse<void>> {
    await this.tokenManager.invalidate(accessToken)

    return noContent()
  }

  override buildValidators({
    accessToken
  }: Authentication.LogoutParams): Validator[] {
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
