import type { User } from '@/domain/models'

export interface FindUserByEmailRepository {
  findByEmail: (
    data: FindUserByEmailRepository.Params
  ) => Promise<FindUserByEmailRepository.Result>
}

export namespace FindUserByEmailRepository {
  export interface Params {
    email: string
  }
  export type Result = User
}
