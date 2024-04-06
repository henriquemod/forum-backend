import type { Register } from '@/domain/usecases/auth'

export interface AddUserRepository {
  add: (data: AddUserRepository.Params) => Promise<AddUserRepository.Result>
}

export namespace AddUserRepository {
  export type Params = Register.Params
  export type Result = Register.Result
}
