import type { AccessToken } from '@/domain/models'

export interface RefreshToken {
  perform: (params: RefreshToken.Params) => Promise<RefreshToken.Result>
}

export namespace RefreshToken {
  export interface Params {
    accessToken: AccessToken
  }

  export type Result =
    | {
        accessToken: AccessToken
      }
    | Error
}
