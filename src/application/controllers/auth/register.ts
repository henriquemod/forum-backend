import { Controller, ok, type HttpResponse } from '@/application/protocols'
import type { User } from '@/data/protocols/db/user'
import type { Register } from '@/domain/usecases/auth'
import { ValidationBuilder as builder, type Validator } from '../../validation'

export class RegisterController extends Controller {
  constructor(private readonly userRepository: User.Add) {
    super()
  }

  async perform({
    username,
    password,
    email
  }: Register.Params): Promise<HttpResponse<Register.Result>> {
    const accessToken = await this.userRepository.add({
      username,
      password,
      email
    })

    return ok({
      id: accessToken.id
    })
  }

  override buildValidators({
    password,
    username,
    email
  }: Register.Params): Validator[] {
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
        .build(),
      ...builder
        .of({
          value: email,
          fieldName: 'email'
        })
        .required()
        .build()
    ]
  }
}
