import { NotFound } from '@/application/errors'
import type { Token, User } from '@/data/protocols/db'

type A = Token.Add & Token.Find & Token.Invalidate

export class DbAddToken implements A {
  constructor(
    private readonly userRepository: User.Find,
    private readonly tokenRepository: Token.Add & Token.Find & Token.Invalidate
  ) {}

  async findByToken(
    accessTokenToFind: string
  ): Promise<Token.FindResult | null> {
    return await this.tokenRepository.findByToken(accessTokenToFind)
  }

  async findByRefreshToken(
    accessTokenToFind: string
  ): Promise<Token.FindResult | null> {
    return await this.tokenRepository.findByRefreshToken(accessTokenToFind)
  }

  async findByUserId(userId: string): Promise<Token.FindResult | null> {
    return await this.tokenRepository.findByUserId(userId)
  }

  async invalidate(accessToken: string): Promise<void> {
    await this.tokenRepository.invalidate(accessToken)
  }

  async add(account: Token.AddParams): Promise<void> {
    const user = await this.userRepository.findByUserId(account.userId)

    if (!user) {
      throw new NotFound('User not found')
    }

    await this.tokenRepository.add({
      accessToken: account.accessToken,
      refreshAccessToken: account.refreshAccessToken,
      userId: user.id
    })
  }
}
