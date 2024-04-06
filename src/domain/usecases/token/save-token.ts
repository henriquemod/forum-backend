import type { AccessToken } from '@/domain/models'

export interface SaveToken {
  save: (account: SaveToken.Params) => Promise<SaveToken.Result>
}

export namespace SaveToken {
  export interface Params {
    email: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }

  export type Result = undefined
}
