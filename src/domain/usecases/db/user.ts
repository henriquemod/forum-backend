import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'

export namespace DBUser {
  export type FindResult = UserModel.SafeModel | UserModel.Model | null
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
    findByEmail: (email: string, safe?: boolean) => Promise<FindResult>
  }

  export interface FindUserByUsername {
    findByUsername: (username: string, safe?: boolean) => Promise<FindResult>
  }

  export interface FindUserByUserId {
    findByUserId: (userId: string, safe?: boolean) => Promise<FindResult>
  }

  export interface FindUserByIdOrFail {
    findUserByIdOrFail: (userId: string) => Promise<UserModel.Model>
  }

  export interface UpdateUser {
    update: (params: UpdateUserParams) => Promise<void>
  }
}
