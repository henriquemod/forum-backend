import type { FindUserByEmail } from '@/domain/usecases/db/user'
import type { SaveToken } from '@/domain/usecases/token'
import type { AddTokenRepository } from '../../../protocols/db/token'

export class DbAddToken implements SaveToken {
  constructor(
    private readonly findYserByUsername: FindUserByEmail,
    private readonly addTokenRepository: AddTokenRepository
  ) {}

  async save(account: SaveToken.Params): Promise<undefined> {
    const user = await this.findYserByUsername.findByEmail({
      email: account.email
    })

    if (!user) {
      throw new Error('User not found')
    }

    await this.addTokenRepository.add({
      accessToken: account.accessToken,
      refreshAccessToken: account.refreshAccessToken,
      userId: user.id
    })
  }
}
