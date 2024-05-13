import type { Token } from '@/data/usecases'
import type { UserModel, AccessTokenModel, TokenModel } from '@/domain/models'
import { MOCK_USER } from './user-stub'

type TokenImplementation = Token.Validate &
  Token.SignIn &
  Token.Invalidate &
  Token.Refresh &
  Token.GetToken

export class TokenStub implements TokenImplementation {
  async getToken(token: string): Promise<TokenModel> {
    return await Promise.resolve({
      accessToken: 'any_access',
      refreshAccessToken: 'any_refresh',
      invalid: false,
      user: MOCK_USER
    })
  }

  async userHasToken(_userId: string): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async validate(_accessToken: string): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async signIn(_user: UserModel.Model): Promise<Token.SignResult> {
    return await Promise.resolve({
      userId: 'any_id',
      accessToken: 'any_access',
      refreshAccessToken: 'any_refresh'
    })
  }

  async invalidate(_accessToken: AccessTokenModel): Promise<void> {}

  async refresh(_accessToken: string): Promise<Token.RefreshResult> {
    return await Promise.resolve({
      accessToken: 'new_access_token',
      accessRefreshToken: 'new_refresh_token'
    })
  }
}
