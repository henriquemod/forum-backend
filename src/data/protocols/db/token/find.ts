import type { AccessToken } from '@/domain/models'

export namespace FindTokenRepository {
  export interface Params {
    accessToken: AccessToken
  }
  export type Result =
    | {
        userId: string
      }
    | undefined
}

export interface FindTokenRepository {
  find: (
    data: FindTokenRepository.Params
  ) => Promise<FindTokenRepository.Result>
}
