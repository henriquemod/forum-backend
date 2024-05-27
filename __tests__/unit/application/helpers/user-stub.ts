import type { User } from '@/data/usecases/'
import { UserModel } from '@/domain/models'

export const MOCK_USER: UserModel.Model = {
  id: 'any_id',
  email: 'any_email',
  username: 'any_username',
  password: 'any_password',
  level: UserModel.Level.USER,
  verifiedEmail: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

export class UserStub
  implements User.Get, User.Register, User.ActivateUser, User.GetPublic
{
  async activate(userId: string): Promise<void> {}

  async getUser(
    value: string,
    origin?: User.Origin | undefined
  ): Promise<UserModel.Model> {
    return await Promise.resolve(MOCK_USER)
  }

  async getPublicUser(
    value: string,
    origin?: User.Origin | undefined
  ): Promise<User.PublicUserData> {
    return await Promise.resolve({
      username: MOCK_USER.username,
      createdAt: MOCK_USER.createdAt
    })
  }

  async registerUser(user: User.RegisterParams): Promise<UserModel.Model> {
    return await Promise.resolve({ ...MOCK_USER, password: 'hashed_password' })
  }

  async findUserByIdOrFail(id: string): Promise<UserModel.Model> {
    return MOCK_USER
  }
}
