import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import {
  type Validator,
  ValidationBuilder as builder
} from '@/application/validation'
import type { User } from '@/data/usecases'

type UserManager = User.DeleteUser
type PerformParams = AuthenticatedRequest<{
  id: string
}>

export class DeleteUserController extends Controller {
  constructor(private readonly userManager: UserManager) {
    super()
  }

  async perform({
    id,
    userId: authenticatedUserId
  }: PerformParams): Promise<HttpResponse<User.PublicUserData>> {
    await this.userManager.delete(authenticatedUserId, id)

    return noContent()
  }

  override buildValidators({ id }: PerformParams): Validator[] {
    return [
      ...builder
        .of({
          value: id,
          fieldName: 'id'
        })
        .required()
        .build()
    ]
  }
}
