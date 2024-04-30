import type { UserModel } from '@/domain/models'

export namespace User {
  export type Origin = 'username' | 'email'

  export interface RegisterResult {
    id: string
  }

  export interface Get {
    getUser: (value: string, origin?: Origin) => Promise<UserModel>
  }

  export interface Register {
    registerUser: (user: Omit<UserModel, 'id'>) => Promise<RegisterResult>
  }
}
