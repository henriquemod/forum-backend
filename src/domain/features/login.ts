import type { AccessToken } from '@/domain/models'
import type { AuthenticationError } from '../errors'

export interface Login {
  perform: (params: Login.Params) => Promise<Login.Result>
}

export namespace Login {
  export interface Params {
    username: string
    password: string
  }

  export type Result =
    | {
        token: AccessToken
        refreshToken: AccessToken
      }
    | AuthenticationError
}
