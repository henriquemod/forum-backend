import type { Authenticate } from '@/domain/features/auth'

export interface AuthenticateRepository {
  auth: (
    data: AuthenticateRepository.Params
  ) => Promise<AuthenticateRepository.Result>
}

export namespace AuthenticateRepository {
  export type Params = Authenticate.Params
  export type Result = Authenticate.Result
}
