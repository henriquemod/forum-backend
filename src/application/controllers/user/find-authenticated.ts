import { Controller, ok } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'

type UserManager = User.Get
type PerformParams = AuthenticatedRequest<void>

export class FindAuthenticatedUserController extends Controller {
  constructor(private readonly userManager: UserManager) {
    super()
  }

  async perform({
    userId
  }: PerformParams): Promise<HttpResponse<UserModel.SafeModel>> {
    const user = await this.userManager.getUser({
      value: userId,
      origin: 'id',
      safe: true
    })

    return ok(user)
  }
}
