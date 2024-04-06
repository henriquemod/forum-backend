import { Controller, ok, type HttpResponse } from '@/application/protocols'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { Authenticate } from '@/domain/usecases/auth'
import type { SaveToken } from '@/domain/usecases/token'
import type { AuthenticateRepository } from '@/data/protocols/db/user'

export class LoginController extends Controller {
  constructor(
    private readonly login: AuthenticateRepository,
    private readonly tokenSaver: SaveToken
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Authenticate.Params): Promise<HttpResponse<Authenticate.Result>> {
    const accessToken = await this.login.authenticate({
      username,
      password
    })

    await this.tokenSaver.save({
      email: accessToken.email,
      accessToken: accessToken.accessToken,
      refreshAccessToken: accessToken.refreshAccessToken
    })

    return ok({
      email: accessToken.email,
      accessToken: accessToken.accessToken,
      refreshAccessToken: accessToken.refreshAccessToken
    })
  }

  override buildValidators({
    password,
    username
  }: Authenticate.Params): Validator[] {
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
