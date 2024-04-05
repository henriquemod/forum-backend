import { Controller } from '@/application/controllers'
import { ok, unauthorized, type HttpResponse } from '@/application/helpers'
import type { Login } from '@/domain/features'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { TokenMongoRepository } from '@/infra/db/mongodb'

export class LoginController extends Controller {
  constructor(
    private readonly login: Login,
    private readonly tokenRepository: TokenMongoRepository
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Login.Params): Promise<HttpResponse<Login.Result>> {
    const accessToken = await this.login.perform({
      username,
      password
    })
    if (accessToken instanceof Error) return unauthorized()

    const repositoryResponse = await this.tokenRepository.add({
      token: accessToken.token
    })

    if (!repositoryResponse) return unauthorized()

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
