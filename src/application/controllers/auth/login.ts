import { Controller } from '@/application/controllers'
import { ok, unauthorized, type HttpResponse } from '@/application/helpers'
import type { Login } from '@/domain/features'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LoginController extends Controller {
  constructor(private readonly login: Login) {
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
    return accessToken instanceof Error
      ? unauthorized()
      : ok({
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
