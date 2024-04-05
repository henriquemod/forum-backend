import type { SaveToken } from '@/domain/features/auth'

export interface AddTokenRepository {
  add: (data: AddTokenRepository.Params) => Promise<AddTokenRepository.Result>
}

export namespace AddTokenRepository {
  export type Params = SaveToken.Params
  export type Result = SaveToken.Result
}
