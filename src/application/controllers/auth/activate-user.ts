import { Controller, noContent } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Session } from '@/application/protocols/session'
import type { Activation, Authentication, User } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type UserManager = User.ActivateUser
type ActivationManager = Activation.GetUserByActivationCode

export class ActivateUserController extends Controller {
  constructor(
    private readonly userManager: UserManager,
    private readonly activationManager: ActivationManager,
    protected readonly session?: Session
  ) {
    super(session)
  }

  async perform({
    code
  }: Activation.GetUserByActivationCodeParams): Promise<
    HttpResponse<Authentication.RegisterResult>
  > {
    const { id } = await this.activationManager.getUser({
      code
    })

    await this.userManager.activate(id)

    return noContent()
  }

  override buildValidators({
    code
  }: Activation.GetUserByActivationCodeParams): Validator[] {
    return [
      ...builder
        .of({
          value: code,
          fieldName: 'code'
        })
        .required()
        .build()
    ]
  }
}
