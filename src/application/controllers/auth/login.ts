import { Forbidden } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Authentication, Token, User } from '@/data/usecases'
import type { Hash } from '@/data/usecases/encryption'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type UserManager = User.Get
type TokenManager = Token.SignIn
type HashComparer = Hash.Compare

export class LoginController extends Controller {
  constructor(
    private readonly userManager: UserManager,
    private readonly tokenManager: TokenManager,
    private readonly hashManager: HashComparer
  ) {
    super()
  }

  async perform({
    username,
    password
  }: Authentication.LoginParams): Promise<
    HttpResponse<Authentication.LoginResult>
  > {
    const user = await this.userManager.getUser(username)

    const isAllowed = await this.hashManager.compare(password, user.password)

    if (!isAllowed) {
      throw new Forbidden('Invalid credentials')
    }

    const data = await this.tokenManager.signIn(user)

    return ok(data)
  }

  override buildValidators({
    password,
    username
  }: Authentication.LoginParams): Validator[] {
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
