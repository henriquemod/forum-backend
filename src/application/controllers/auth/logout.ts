import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Token } from '@/data/protocols/token'
import type { Logout } from '@/domain/usecases/auth'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LogoutController extends Controller {
  constructor(private readonly token: Token.Invalidate) {
    super()
  }

  async perform({ accessToken }: Logout.Params): Promise<HttpResponse<void>> {
    await this.token.invalidate(accessToken)

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
