import type { AddToken } from '@/domain/features/auth'

export interface AddTokenRepository {
  add: (data: AddTokenRepository.Params) => Promise<AddTokenRepository.Result>
}

export namespace AddTokenRepository {
  export type Params = AddToken.Params
  export type Result = AddToken.Result
}
