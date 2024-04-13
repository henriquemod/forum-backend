import { UnauthorizedError } from '@/application/errors'
import type { Token } from '@/data/protocols/db/token'

export class TokenManager implements Token.Validate, Token.Refresh {
  constructor(
    private readonly tokenRepository: Token.Find,
    private readonly jwt: Token.Validate & Token.SignIn & Token.Refresh
  ) {}

  async validate(accessToken: string): Promise<boolean> {
    const userToken = await this.tokenRepository.findByToken(accessToken)

    if (!userToken) {
      return false
    }

    return await this.jwt.validate(accessToken)
  }

  async refresh(accessRefreshToken: string): Promise<Token.RefreshResult> {
    const userAccessToken =
      await this.tokenRepository.findByRefreshToken(accessRefreshToken)

    if (!userAccessToken) {
      throw new UnauthorizedError()
    }

    const allowed = await this.jwt.validate(userAccessToken.accessToken)

    if (!allowed) {
      throw new UnauthorizedError()
    }

    const newTokenData = await this.jwt.signIn(userAccessToken.user)

    return {
      accessToken: newTokenData.accessToken,
      accessRefreshToken: newTokenData.refreshAccessToken
    }
  }
}
