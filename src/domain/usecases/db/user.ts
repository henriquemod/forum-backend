import type { User } from '@/data/usecases'
import type { UserModel } from '@/domain/models'

export namespace DBUser {
  export interface AddResult {
    id: string
  }
  export interface Add {
    add: (user: User.RegisterParams) => Promise<AddResult>
  }

  export interface Find {
    findByEmail: (email: string) => Promise<UserModel.Model | null>
    findByUsername: (username: string) => Promise<UserModel.Model | null>
    findByUserId: (userId: string) => Promise<UserModel.Model | null>
  }
}
