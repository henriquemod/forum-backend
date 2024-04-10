import type { AccessToken, User } from '@/domain/models'

export namespace Token {
  export type ValidateResult = boolean
  export interface RefreshResult {
    accessToken: AccessToken
    accessRefreshToken: AccessToken
  }
  export interface Validate {
    validate: (accessToken: AccessToken) => Promise<ValidateResult>
  }
  export interface Refresh {
    refresh: (accessToken: AccessToken) => Promise<RefreshResult>
  }

  export interface SignResult {
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }
  export interface SignIn {
    signIn: (user: User) => Promise<SignResult>
  }

  export interface Invalidate {
    invalidate: (accessToken: AccessToken) => Promise<void>
  }

  export interface AddParams {
    userId: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }
  export interface Add {
    add: (params: AddParams) => Promise<void>
  }

  export interface FindResult extends User {
    accessToken: AccessToken
  }
  export interface Find {
    findByToken: (
      accessTokenToFind: AccessToken
    ) => Promise<FindResult | undefined>
    findByRefreshToken: (
      accessTokenToFind: AccessToken
    ) => Promise<FindResult | undefined>
  }
}
