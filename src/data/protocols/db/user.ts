import type { User as UserModel } from '@/domain/models'

export namespace User {
  export interface AddResult {
    id: string
  }
  export interface Add {
    add: (user: Omit<UserModel, 'id'>) => Promise<AddResult>
  }

  export interface Find {
    findByEmail: (email: string) => Promise<UserModel>
    findByUsername: (username: string) => Promise<UserModel>
  }
}
