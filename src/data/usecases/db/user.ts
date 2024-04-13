import type { User as UserModel } from '@/domain/models'

export namespace User {
  export interface AddResult {
    id: string
  }
  export interface Add {
    add: (user: Omit<UserModel, 'id'>) => Promise<AddResult>
  }

  export interface Find {
    findByEmail: (email: string) => Promise<UserModel | null>
    findByUsername: (username: string) => Promise<UserModel | null>
    findByUserId: (userId: string) => Promise<UserModel | null>
  }
}
