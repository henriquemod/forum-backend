import { NotFound } from '@/application/errors'
import type { Token } from '@/data/usecases'
import type { TokenModel, UserModel } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db'

type TokenDBUsecases = DBToken.FindTokenByUserId &
  DBToken.FindTokenByToken &
  DBToken.FindTokenByRefreshToken &
  DBToken.Delete &
  DBToken.Add

type TokenDataUsecases = Token.SignIn &
  Token.Invalidate &
  Token.Refresh &
  Token.Validate &
  Token.GetToken

export class TokenManager implements TokenDataUsecases {
  constructor(
    private readonly tokenRepository: TokenDBUsecases,
    private readonly jwtManager: Token.SignIn
  ) {}

  async getToken(token: string): Promise<TokenModel> {
    const tokenData = await this.tokenRepository.findByToken(token)
    if (!tokenData) {
      throw new NotFound('Token not found')
    }

    return tokenData
  }

  async userHasToken(userId: string): Promise<boolean> {
    const token = await this.tokenRepository.findByUserId(userId)

    return !!token
  }

  async validate(accessToken: string): Promise<boolean> {
    const token = await this.tokenRepository.findByToken(accessToken)

    return !!token
  }

  async refresh(accessToken: string): Promise<Token.RefreshResult> {
    const token = await this.tokenRepository.findByRefreshToken(accessToken)
    if (!token) {
      throw new NotFound('Token not found')
    }
    const data = await this.signIn(token.user)

    return {
      accessToken: data.accessToken,
      accessRefreshToken: data.refreshAccessToken
    }
  }

  async invalidate(accessToken: string): Promise<void> {
    await this.tokenRepository.delete(accessToken)
  }

  async signIn(user: UserModel.Model): Promise<Token.SignResult> {
    const token = await this.tokenRepository.findByUserId(user.id)

    if (token) {
      await this.tokenRepository.delete(token.accessToken)
    }

    const tokenData = await this.jwtManager.signIn(user)

    await this.tokenRepository.add({
      accessToken: tokenData.accessToken,
      refreshAccessToken: tokenData.refreshAccessToken,
      userId: user.id
    })

    return tokenData
  }
}
