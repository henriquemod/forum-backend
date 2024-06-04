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
  implements
    User.Get,
    User.Register,
    User.ActivateUser,
    User.GetPublic,
    User.DeleteUser
{
  async delete(_authenticatedUserId: string, _userId: string): Promise<void> {}

  async activate(_userId: string): Promise<void> {}

  async getUser<T extends User.GetUserParams>(
    _params: T
  ): Promise<T['safe'] extends true ? UserModel.SafeModel : UserModel.Model> {
    return await Promise.resolve(MOCK_USER)
  }

  async getPublicUser(
    _params: User.GetUserParams
  ): Promise<User.PublicUserData> {
    return await Promise.resolve({
      username: MOCK_USER.username,
      createdAt: MOCK_USER.createdAt
    })
  }

  async registerUser(_user: User.RegisterParams): Promise<UserModel.Model> {
    return await Promise.resolve({ ...MOCK_USER, password: 'hashed_password' })
  }

  async findUserByIdOrFail(_id: string): Promise<UserModel.Model> {
    return MOCK_USER
  }
}
