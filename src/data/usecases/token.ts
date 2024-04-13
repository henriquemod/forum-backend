import { Forbidden, NotFound } from '@/application/errors'
import type { Token } from '@/data/protocols/db/token'

export class TokenManager implements Token.Validate, Token.Refresh {
  constructor(
    private readonly tokenRepository: Token.Find & Token.Add,
    private readonly jwt: Token.Validate &
      Token.SignIn &
      Token.Refresh &
      Token.Invalidate
  ) {}

  async validate(accessToken: string): Promise<boolean> {
    const userToken = await this.tokenRepository.findByToken(accessToken)

    if (!userToken) {
      throw new NotFound('Invalid access token')
    }

    return await this.jwt.validate(accessToken)
  }

  async refresh(accessRefreshToken: string): Promise<Token.RefreshResult> {
    const userAccessToken =
      await this.tokenRepository.findByRefreshToken(accessRefreshToken)

    if (!userAccessToken) {
      throw new NotFound('Invalid refresh token')
    }

    const allowed = await this.jwt.validate(userAccessToken.accessToken)

    if (!allowed) {
      throw new Forbidden('Invalid or expired access token')
    }

    await this.jwt.invalidate(userAccessToken.accessToken)

    const newTokenData = await this.jwt.signIn(userAccessToken.user)

    await this.tokenRepository.add({
      accessToken: newTokenData.accessToken,
      refreshAccessToken: newTokenData.refreshAccessToken,
      userId: userAccessToken.user.id
    })

    return {
      accessToken: newTokenData.accessToken,
      accessRefreshToken: newTokenData.refreshAccessToken
    }
  }
}
