import type { AccessToken } from '@/domain/models'

export namespace InvalidateTokenRepository {
  export type Params = AccessToken
  export type Result = undefined
}

export interface InvalidateTokenRepository {
  invalidate: (
    accessToken: InvalidateTokenRepository.Params
  ) => Promise<InvalidateTokenRepository.Result>
}
