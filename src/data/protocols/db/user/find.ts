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

export interface FindUserByUsernameRepository {
  findByUsername: (
    data: FindUserByUsernameRepository.Params
  ) => Promise<FindUserByUsernameRepository.Result>
}

export namespace FindUserByUsernameRepository {
  export interface Params {
    username: string
  }
  export type Result = User
}
