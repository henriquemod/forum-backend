import { NotFound } from '@/application/errors'
import type { Token } from '@/data/usecases'
import type { UserModel } from '@/domain/models'
import type { DBToken, DBUser } from '@/domain/usecases/db'

type TokenDBUsecases = DBToken.FindTokenByUserId &
  DBToken.FindTokenByToken &
  DBToken.Delete &
  DBToken.Add

type TokenDataUsecases = Token.SignIn &
  Token.Invalidate &
  Token.Refresh &
  Token.Validate

export class TokenManager implements TokenDataUsecases {
  constructor(
    private readonly tokenRepository: TokenDBUsecases,
    private readonly userRepository: DBUser.FindUserByUserId,
    private readonly jwtManager: Token.SignIn
  ) {}

  async userHasToken(userId: string): Promise<boolean> {
    const token = await this.tokenRepository.findByUserId(userId)
    return !!token
  }

  async validate(accessToken: string): Promise<boolean> {
    const token = await this.tokenRepository.findByToken(accessToken)
    return !!token
  }

  async refresh(accessToken: string): Promise<Token.RefreshResult> {
    const token = await this.tokenRepository.findByToken(accessToken)
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
    const userData = await this.tokenRepository.findByUserId(user.id)

    if (userData) {
      await this.tokenRepository.delete(userData.accessToken)
    }

    const findUser = await this.userRepository.findByUserId(user.id)

    if (!findUser) {
      throw new NotFound('User not found')
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
