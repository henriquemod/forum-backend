import type { AccessToken, User } from '@/domain/models'

export namespace RefreshToken {
  export interface Params extends User {
    accessRefreshToken: AccessToken
  }
  export interface Result {
    accessToken: AccessToken
    accessRefreshToken: AccessToken
  }
}

export interface RefreshToken {
  refresh: (
    accessRefreshToken: RefreshToken.Params
  ) => Promise<RefreshToken.Result>
}
