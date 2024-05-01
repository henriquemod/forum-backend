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

  export interface FindResult {
    accessToken: AccessTokenModel
    user: UserModel.Model
  }
  export interface Find {
    findByToken: (
      accessTokenToFind: AccessTokenModel
    ) => Promise<FindResult | null>
    findByRefreshToken: (
      accessTokenToFind: AccessTokenModel
    ) => Promise<FindResult | null>
    findByUserId: (userId: string) => Promise<FindResult | null>
  }
}
