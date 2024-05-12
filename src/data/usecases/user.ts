import type { UserModel } from '@/domain/models'

export namespace User {
  export type Origin = 'username' | 'email' | 'id'

  export interface RegisterResult {
    id: string
  }

  export interface Get {
    getUser: (value: string, origin?: Origin) => Promise<UserModel.Model>
  }

  export type RegisterParams = Omit<UserModel.Model, 'id' | 'level'> &
    Partial<Pick<UserModel.Model, 'level'>>

  export interface Register {
    registerUser: (user: RegisterParams) => Promise<RegisterResult>
  }
}
