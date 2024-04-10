import type { AccessToken } from '@/domain/models'

export interface Logout {
  logout: (params: Logout.Params) => Promise<void>
}

export namespace Logout {
  export interface Params {
    accessToken: AccessToken
  }
}
