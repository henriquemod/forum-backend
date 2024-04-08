import type { AccessToken, Token } from '@/domain/models'

export namespace FindTokenRepository {
  export interface Params {
    accessToken: AccessToken
  }
  export type Result = Token | undefined
}

export interface FindTokenRepository {
  find: (
    data: FindTokenRepository.Params
  ) => Promise<FindTokenRepository.Result>
}

export namespace FindRefreshTokenRepository {
  export interface Params {
    accessRefreshToken: AccessToken
  }
  export type Result = Token | undefined
}

export interface FindRefreshTokenRepository {
  findRefreshToken: (
    data: FindRefreshTokenRepository.Params
  ) => Promise<FindRefreshTokenRepository.Result>
}
