import type {
  FindUserByEmailRepository,
  FindUserByUsernameRepository
} from '@/data/protocols/db/user'
import type { FindUserByEmail } from '@/domain/usecases/db/user'

export class DBFindUserByUsername implements FindUserByEmail {
  constructor(
    private readonly findUserByEmailRepository: FindUserByUsernameRepository
  ) {}

  async findByEmail(
    params: FindUserByEmailRepository.Params
  ): Promise<FindUserByEmailRepository.Result> {
    const user = await this.findUserByEmailRepository.findByUsername({
      username: params.email
    })

    return user
  }
}
