import type { AccessTokenModel, UserModel } from '@/domain/models'

export namespace Token {
  export type ValidateResult = boolean

  export interface RefreshResult {
    accessToken: AccessTokenModel
    accessRefreshToken: AccessTokenModel
  }

  export interface SignResult {
    userId: string
    accessToken: AccessTokenModel
    refreshAccessToken: AccessTokenModel
  }

  export interface Validate {
    userHasToken: (userId: string) => Promise<ValidateResult>
    validate: (accessToken: AccessTokenModel) => Promise<ValidateResult>
  }

  export interface Invalidate {
    invalidate: (accessToken: AccessTokenModel) => Promise<void>
  }

  export interface Refresh {
    refresh: (accessToken: AccessTokenModel) => Promise<RefreshResult>
  }

  export interface SignIn {
    signIn: (user: UserModel.Model) => Promise<SignResult>
  }
}
