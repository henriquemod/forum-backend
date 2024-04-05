import type { AddUser } from '@/domain/features/auth'

export interface AddUserRepository {
  add: (data: AddUserRepository.Params) => Promise<AddUserRepository.Result>
}

export namespace AddUserRepository {
  export type Params = AddUser.Params
  export type Result = AddUser.Result
}
