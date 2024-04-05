import { Controller } from '@/application/controllers'
import { badRequest, ok, type HttpResponse } from '@/application/helpers'
import { ValidationBuilder as builder, type Validator } from '../../validation'
import type { AddUserRepository } from '@/data/protocols/db/token'
import type { Register } from '@/domain/features/auth'

export class RegisterController extends Controller {
  constructor(private readonly userRepository: AddUserRepository) {
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

    if (accessToken instanceof Error) return badRequest(accessToken)

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
