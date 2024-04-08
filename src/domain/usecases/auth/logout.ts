import type { AccessToken } from '@/domain/models'

export interface Logout {
  logout: (params: Logout.Params) => Promise<Logout.Result>
}

export namespace Logout {
  export interface Params {
    accessToken: AccessToken
  }

  export type Result = undefined | Error
}
