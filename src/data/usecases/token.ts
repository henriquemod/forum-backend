import type { AccessToken, User } from '@/domain/models'

export namespace Token {
  export type ValidateResult = boolean

  export interface RefreshResult {
    accessToken: AccessToken
    accessRefreshToken: AccessToken
  }

  export interface SignResult {
    userId: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }

  export interface Validate {
    userHasToken: (userId: string) => Promise<ValidateResult>
    validate: (accessToken: AccessToken) => Promise<ValidateResult>
  }

  export interface Invalidate {
    invalidate: (accessToken: AccessToken) => Promise<void>
  }

  export interface Refresh {
    refresh: (accessToken: AccessToken) => Promise<RefreshResult>
  }

  export interface SignIn {
    signIn: (user: User) => Promise<SignResult>
  }
}
