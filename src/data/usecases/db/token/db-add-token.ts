import type { Token } from '../../../protocols/db/token'
import type { User } from '@/data/protocols/db'

export class DbAddToken implements Token.Add {
  constructor(
    private readonly findYserByUsername: User.Find,
    private readonly addTokenRepository: Token.Add
  ) {}

  async add(account: Token.AddParams): Promise<void> {
    const user = await this.findYserByUsername.findByUserId(account.userId)

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
