import { Controller } from '@/application/controllers'
import { ok, unauthorized, type HttpResponse } from '@/application/helpers'
import type { AddTokenRepository } from '@/data/protocols/db/token'
import type { AuthenticateRepository } from '@/data/protocols/db/user/find'
import type { Login } from '@/domain/features'
import { ValidationBuilder as builder, type Validator } from '../../validation'

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
  }: Login.Params): Promise<HttpResponse<Login.Result>> {
    const accessToken = await this.login.auth({
      username,
      password
    })
    if (accessToken instanceof Error) return unauthorized()

    // await this.tokenRepository.add({
    //   token: accessToken.token,
    //   userId: 'a'
    // })

    return ok({
      token: accessToken.token,
      refreshToken: accessToken.refreshToken
    })
  }

  override buildValidators({ password, username }: Login.Params): Validator[] {
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
