import { Controller } from '@/application/controllers'
import { ok, type HttpResponse } from '@/application/helpers'
import type { AddTokenRepository } from '@/data/protocols/db/token'
import type { AuthenticateRepository } from '@/data/protocols/db/user/find'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { Authenticate } from '@/domain/features/auth'

export class LoginController extends Controller {
  constructor(
    private readonly login: AuthenticateRepository,
    private readonly tokenRepository: AddTokenRepository
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Authenticate.Params): Promise<HttpResponse<Authenticate.Result>> {
    const accessToken = await this.login.auth({
      username,
      password
    })

    // await this.tokenRepository.add({
    //   token: accessToken.token,
    //   userId: 'a'
    // })

    return ok({
      token: accessToken.token,
      refreshToken: accessToken.refreshToken
    })
  }

  override buildValidators({ password, username }: Authenticate.Params): Validator[] {
    return [
      ...builder
        .of({
          value: password,
          fieldName: 'password'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: username,
          fieldName: 'username'
        })
        .required()
        .build()
    ]
  }
}
