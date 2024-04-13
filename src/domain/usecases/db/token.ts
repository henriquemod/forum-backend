import type { AccessToken, User } from '@/domain/models'

export namespace DBToken {
  export interface AddParams {
    userId: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }
  export interface Add {
    add: (params: AddParams) => Promise<void>
  }

  export interface Delete {
    delete: (accessToken: AccessToken) => Promise<void>
  }

  export interface FindResult {
    accessToken: AccessToken
    user: User
  }
  export interface Find {
    findByToken: (accessTokenToFind: AccessToken) => Promise<FindResult | null>
    findByRefreshToken: (
      accessTokenToFind: AccessToken
    ) => Promise<FindResult | null>
    findByUserId: (userId: string) => Promise<FindResult | null>
  }
}
