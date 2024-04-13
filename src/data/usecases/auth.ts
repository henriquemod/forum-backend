import type { AccessToken } from '@/domain/models'

export namespace Authentication {
  export interface LoginParams {
    username: string
    password: string
  }

  export interface LogoutParams {
    accessToken: AccessToken
  }

  export interface RegisterParams {
    username: string
    password: string
    email: string
  }

  export interface LoginResult {
    userId: string
    accessToken: AccessToken
    refreshAccessToken: AccessToken
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
