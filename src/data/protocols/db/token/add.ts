import type { AccessToken } from '@/domain/models'

export namespace AddTokenRepository {
  export interface Params {
    userId: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
  }
  export type Result = undefined
}

export interface AddTokenRepository {
  add: (data: AddTokenRepository.Params) => Promise<AddTokenRepository.Result>
}
