import type { UserModel } from '@/domain/models'

export namespace User {
  export type Origin = 'username' | 'email' | 'id'
  export type PublicUserData = Pick<
    UserModel.SafeModel,
    'username' | 'createdAt'
  >

  export interface GetUserParams {
    value: string
    origin?: Origin
    safe?: boolean
  }

  type GetUserReturnType<T extends GetUserParams> = T['safe'] extends true
    ? UserModel.SafeModel
    : UserModel.Model

  export interface Get {
    getUser: <T extends GetUserParams>(
      params: T
    ) => Promise<GetUserReturnType<T>>
  }

  export interface GetPublic {
    getPublicUser: (params: GetUserParams) => Promise<PublicUserData>
  }

  export type RegisterParams = Omit<
    UserModel.Model,
    'id' | 'level' | 'createdAt' | 'updatedAt' | 'verifiedEmail'
  > &
    Partial<Pick<UserModel.Model, 'level'>>

  export interface Register {
    registerUser: (user: RegisterParams) => Promise<UserModel.SafeModel>
  }

  export interface ActivateUser {
    activate: (userId: string) => Promise<void>
  }

  export interface DeleteUser {
    delete: (authenticatedUserId: string, userId: string) => Promise<void>
  }
}
