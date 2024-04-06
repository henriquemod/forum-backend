import type { FindUserByEmailRepository } from '@/data/protocols/db/user'
import type { FindUserByEmail } from '@/domain/usecases/db/user'

export class DBFindUserByEmail implements FindUserByEmail {
  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository
  ) {}

  async findByEmail(
    params: FindUserByEmailRepository.Params
  ): Promise<FindUserByEmailRepository.Result> {
    const user = await this.findUserByEmailRepository.findByEmail({
      email: params.email
    })

    return user
  }
}
