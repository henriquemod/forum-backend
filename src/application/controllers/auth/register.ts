import { BadRequest } from '@/application/errors'
import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Authentication } from '@/data/usecases'
import type { DBUser } from '@/domain/usecases/db/user'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type userRepository = DBUser.Add & DBUser.Find

export class RegisterController extends Controller {
  constructor(private readonly userRepository: userRepository) {
    super()
  }

  async perform({
    username,
    password,
    email
  }: Authentication.RegisterParams): Promise<
    HttpResponse<Authentication.RegisterResult>
  > {
    const hasUsername = !!(await this.userRepository.findByUsername(username))
    const hasEmail = !!(await this.userRepository.findByEmail(email))

    if (hasUsername) {
      throw new BadRequest('Username already in use')
    }

    if (hasEmail) {
      throw new BadRequest('Email already in use')
    }

    const { id } = await this.userRepository.add({
      username,
      password,
      email
    })

    return ok({
      id
    })
  }

  override buildValidators({
    password,
    username,
    email
  }: Authentication.RegisterParams): Validator[] {
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
