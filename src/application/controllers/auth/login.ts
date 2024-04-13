import { Forbidden } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Hash } from '@/data/usecases/encryption'
import type { Token } from '@/data/usecases/token'
import type { Login } from '@/domain/usecases/auth'
import type { DBUser } from '@/domain/usecases/db/user'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class LoginController extends Controller {
  constructor(
    private readonly userRepository: DBUser.Find,
    private readonly tokenSignIn: Token.SignIn,
    private readonly hashComparer: Hash.Compare
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Login.Params): Promise<HttpResponse<Login.Result>> {
    const user = await this.userRepository.findByUsername(username)

    if (!user) {
      throw new Forbidden('Invalid credentials')
    }

    const isAllowed = await this.hashComparer.compare(password, user.password)

    if (!isAllowed) {
      throw new Forbidden('Invalid credentials')
    }

    const data = await this.tokenSignIn.signIn(user)

    return ok(data)
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
