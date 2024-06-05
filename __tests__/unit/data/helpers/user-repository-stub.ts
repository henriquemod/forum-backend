import { omit } from 'ramda'

import type { User } from '@/data/usecases'
import { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

type FindUser = DBUser.FindUserByEmail &
  DBUser.FindUserByUsername &
  DBUser.FindUserByUserId
export type DBUserStub = FindUser &
  DBUser.Add &
  DBUser.UpdateUser &
  DBUser.Delete

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
export const SAFE_USER = omit(['password'], MOCK_USER)

export class UserRepositoryStub implements DBUserStub {
  async delete(_id: string): Promise<void> {}

  async update(_params: DBUser.UpdateUserParams): Promise<void> {}

  async findByEmail(_email: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUsername(_username: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUserId(_userId: string): Promise<UserModel.Model | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async add(_user: User.RegisterParams): Promise<UserModel.Model> {
    return await Promise.resolve(MOCK_USER)
  }
}
