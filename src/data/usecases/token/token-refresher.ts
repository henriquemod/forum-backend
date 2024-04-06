import type { AccessToken } from '@/domain/models'

export namespace RefreshToken {
  export type Params = AccessToken
  export interface Result {
    accessToken: AccessToken
  }
}

export interface RefreshToken {
  refresh: (accessToken: RefreshToken.Params) => Promise<RefreshToken.Result>
}
