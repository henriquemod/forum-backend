import type { AccessToken, User } from '@/domain/models'

export interface AuthenticateRepository {
  authenticate: (
    data: AuthenticateRepository.Params
  ) => Promise<AuthenticateRepository.Result>
}

export namespace AuthenticateRepository {
  export interface Params {
    username: string
    password: string
  }
  export type Result = User & {
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }
}
