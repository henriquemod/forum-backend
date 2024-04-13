import { Controller, ok, type HttpResponse } from '@/application/protocols'
import type { Token } from '@/data/protocols/db'
import type { User } from '@/data/protocols/db/user'
import type { Login } from '@/domain/usecases/auth'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LoginController extends Controller {
  constructor(
    private readonly userRepository: User.Find,
    private readonly tokenSaver: Token.Add,
    private readonly tokenGenerator: Token.SignIn
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Login.Params): Promise<HttpResponse<Login.Result>> {
    const user = await this.userRepository.findByUsername(username)

    if (user.password !== password) {
      // NOTE - Passwords should be hashed in a real-world application
      throw new Error('Invalid credentials')
    }

    const { accessToken, refreshAccessToken } =
      await this.tokenGenerator.signIn(user)

    const entity = {
      userId: user.id,
      accessToken,
      refreshAccessToken
    }

    await this.tokenSaver.add({
      userId: user.id,
      accessToken,
      refreshAccessToken
    })

    return ok(entity)
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
