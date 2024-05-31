import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { User } from '@/data/usecases'

type UserManager = User.GetPublic
interface PerformParams {
  id: string
}

export class FindUserController extends Controller {
  constructor(private readonly userManager: UserManager) {
    super()
  }

  async perform({
    id
  }: PerformParams): Promise<HttpResponse<User.PublicUserData>> {
    const user = await this.userManager.getPublicUser({
      value: id,
      origin: 'id'
    })

    return ok(user)
  }
}
