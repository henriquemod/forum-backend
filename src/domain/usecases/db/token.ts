import type { AccessTokenModel, UserModel } from '@/domain/models'

export namespace DBToken {
  export interface AddParams {
    userId: string
    accessToken: AccessTokenModel
    refreshAccessToken: AccessTokenModel
  }

  export interface Add {
    add: (params: AddParams) => Promise<void>
  }

  export interface Delete {
    delete: (accessToken: AccessTokenModel) => Promise<void>
  }

  export type FindResult = {
    accessToken: AccessTokenModel
    user: UserModel.Model
  } | null

  export interface FindTokenByToken {
    findByToken: (accessTokenToFind: AccessTokenModel) => Promise<FindResult>
  }

  export interface FindTokenByRefreshToken {
    findByRefreshToken: (
      accessTokenToFind: AccessTokenModel
    ) => Promise<FindResult>
  }

  export interface FindTokenByUserId {
    findByUserId: (userId: string) => Promise<FindResult>
  }
}
