import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'

export namespace DBUser {
  export interface UpdateUserParams {
    userId: string
    userData: Partial<
      Pick<UserModel.Model, 'password' | 'verifiedEmail' | 'email'>
    >
  }
  export interface Add {
    add: (user: User.RegisterParams) => Promise<UserModel.SafeModel>
  }

  export interface Delete {
    delete: (id: string) => Promise<void>
  }

  export interface FindUserByEmail {
    findByEmail: (email: string) => Promise<UserModel.Model | null>
  }

  export interface FindUserByUsername {
    findByUsername: (username: string) => Promise<UserModel.Model | null>
  }

  export interface FindUserByUserId {
    findByUserId: (userId: string) => Promise<UserModel.Model | null>
  }

  export interface FindUserByIdOrFail {
    findUserByIdOrFail: (userId: string) => Promise<UserModel.Model>
  }

  export interface UpdateUser {
    update: (params: UpdateUserParams) => Promise<void>
  }
}
