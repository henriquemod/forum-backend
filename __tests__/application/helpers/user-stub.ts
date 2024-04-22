import type { User } from '@/data/usecases/'
import type { User as UserModel } from '@/domain/models'

export class UserStub implements User.Get, User.Register {
  async getUser(
    value: string,
    origin?: User.Origin | undefined
  ): Promise<UserModel> {
    return await Promise.resolve({
      id: 'any_id',
      email: 'any_email',
      username: 'any_username',
      password: 'any_password'
    })
  }

  async registerUser(
    user: Omit<UserModel, 'id'>
  ): Promise<User.RegisterResult> {
    return { id: 'any_id' }
  }
}
