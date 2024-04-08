import { UnauthorizedError } from '@/application/errors'
import type {
  FindRefreshTokenRepository,
  FindTokenRepository,
  RefreshToken,
  RefreshTokenValidate,
  SignInToken,
  TokenValidate
} from '@/data/protocols/db/token'

export class TokenManager implements TokenValidate, RefreshToken {
  constructor(
    private readonly tokenRepository: FindTokenRepository &
      FindRefreshTokenRepository,
    private readonly jwt: TokenValidate & SignInToken & RefreshTokenValidate
  ) {}

  async validate(accessToken: string): Promise<boolean> {
    const userToken = await this.tokenRepository.find({ accessToken })

    if (!userToken) {
      return false
    }

    return await this.jwt.validate(accessToken)
  }

  async refresh({
    accessRefreshToken
  }: RefreshToken.Params): Promise<RefreshToken.Result> {
    const userToken = await this.tokenRepository.findRefreshToken({
      accessRefreshToken
    })

    if (!userToken) {
      throw new UnauthorizedError()
    }

    const allowed = await this.jwt.validateRefreshToken(
      userToken.refreshAccessToken
    )

    if (!allowed) {
      throw new UnauthorizedError()
    }

    const newTokenData = await this.jwt.signIn(userToken.user)

    return {
      accessToken: newTokenData.accessToken,
      accessRefreshToken: newTokenData.refreshAccessToken
    }
  }
}
