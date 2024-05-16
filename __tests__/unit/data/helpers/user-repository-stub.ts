import type { User } from '@/data/usecases'
import { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

type FindUser = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId
export type DBUserStub = FindUser & DBUser.Add & DBUser.UpdateUser

export const MOCK_USER = {
  id: 'any_id',
  email: 'any_email',
  username: 'any_username',
  password: 'any_password',
  level: UserModel.Level.USER,
  verifiedEmail: false,
  createdAt: new Date(),
  updatedAt: new Date()
}

export class UserRepositoryStub implements DBUserStub {
  async update(params: DBUser.UpdateUserParams): Promise<void> {}

  async findByEmail(email: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUsername(username: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUserId(userId: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async add(user: User.RegisterParams): Promise<DBUser.AddResult> {
    return await Promise.resolve({ id: MOCK_USER.id })
  }
}
