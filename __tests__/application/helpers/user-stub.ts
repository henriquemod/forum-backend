import type { User } from '@/data/usecases/'
import { UserModel } from '@/domain/models'

export class UserStub implements User.Get, User.Register {
  async getUser(
    value: string,
    origin?: User.Origin | undefined
  ): Promise<UserModel.Model> {
    return await Promise.resolve({
      id: 'any_id',
      email: 'any_email',
      username: 'any_username',
      password: 'any_password',
      level: UserModel.Level.USER
    })
  }

  async registerUser(user: User.RegisterParams): Promise<User.RegisterResult> {
    return { id: 'any_id' }
  }
}
