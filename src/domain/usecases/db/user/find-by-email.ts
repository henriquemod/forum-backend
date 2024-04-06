import type { FindUserByEmailRepository } from '@/data/protocols/db/user'

export interface FindUserByEmail {
  findByEmail: (
    params: FindUserByEmailRepository.Params
  ) => Promise<FindUserByEmailRepository.Result>
}
