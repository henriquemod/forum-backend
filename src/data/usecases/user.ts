import type { User as UserModel } from '@/domain/models'

export namespace User {
  export type Origin = 'username' | 'email'

  export interface GetUser {
    getUser: (value: string, origin?: Origin) => Promise<UserModel>
  }
}
