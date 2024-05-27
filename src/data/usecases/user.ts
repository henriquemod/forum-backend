import type { UserModel } from '@/domain/models'

export namespace User {
  export type Origin = 'username' | 'email' | 'id'
  export type PublicUserData = Pick<UserModel.Model, 'username' | 'createdAt'>

  export interface Get {
    getUser: (value: string, origin?: Origin) => Promise<UserModel.Model>
  }

  export interface GetPublic {
    getPublicUser: (value: string, origin?: Origin) => Promise<PublicUserData>
  }

  export type RegisterParams = Omit<
    UserModel.Model,
    'id' | 'level' | 'createdAt' | 'updatedAt' | 'verifiedEmail'
  > &
    Partial<Pick<UserModel.Model, 'level'>>

  export interface Register {
    registerUser: (user: RegisterParams) => Promise<UserModel.Model>
  }

  export interface ActivateUser {
    activate: (userId: string) => Promise<void>
  }

  export interface DeleteUser {
    delete: (authenticatedUserId: string, userId: string) => Promise<void>
  }
}
