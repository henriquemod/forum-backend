import type { AccessTokenModel } from '@/domain/models'

export namespace Authentication {
  export interface LoginParams {
    username: string
    password: string
  }

  export interface LogoutParams {
    accessToken: AccessTokenModel
  }

  export interface RegisterParams {
    username: string
    password: string
    email: string
  }

  export interface LoginResult {
    userId: string
    accessToken: AccessTokenModel
    refreshAccessToken: AccessTokenModel
  }

  export interface RegisterResult {
    id: string
  }

  export interface Login {
    login: (account: LoginParams) => Promise<LoginResult>
  }

  export interface Logout {
    logout: (params: LogoutParams) => Promise<void>
  }

  export interface Register {
    register: (params: RegisterParams) => Promise<RegisterResult>
  }
}
