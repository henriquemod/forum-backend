import type { AccessTokenModel, TokenModel } from '@/domain/models'

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

  export interface FindTokenByToken {
    findByToken: (
      accessTokenToFind: AccessTokenModel
    ) => Promise<TokenModel | null>
  }

  export interface FindTokenByRefreshToken {
    findByRefreshToken: (
      accessTokenToFind: AccessTokenModel
    ) => Promise<TokenModel | null>
  }

  export interface FindTokenByUserId {
    findByUserId: (userId: string) => Promise<TokenModel | null>
  }
}
