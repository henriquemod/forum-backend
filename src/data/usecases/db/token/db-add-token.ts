import type { SaveToken } from '@/domain/usecases/token'
import type { Token } from '../../../protocols/db/token'
import type { User } from '@/data/protocols/db'

export class DbAddToken implements SaveToken {
  constructor(
    private readonly findYserByUsername: User.Find,
    private readonly addTokenRepository: Token.Add
  ) {}

  async save(account: SaveToken.Params): Promise<undefined> {
    const user = await this.findYserByUsername.findByEmail(account.email)

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
