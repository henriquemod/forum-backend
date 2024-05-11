import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'

export namespace DBUser {
  export interface AddResult {
    id: string
  }

  export type FindUserResult = UserModel.Model | null
  export interface Add {
    add: (user: User.RegisterParams) => Promise<AddResult>
  }

  export interface FindUserByEmail {
    findByEmail: (email: string) => Promise<FindUserResult>
  }

  export interface FindUserByUsername {
    findByUsername: (username: string) => Promise<FindUserResult>
  }

  export interface FindUserByUserId {
    findByUserId: (userId: string) => Promise<FindUserResult>
  }

  export interface FindUserByIdOrFail {
    findUserByIdOrFail: (userId: string) => Promise<UserModel.Model>
  }
}
