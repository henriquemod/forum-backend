import type { TokenModel } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db'

import { MOCK_USER } from './user-repository-stub'

export type DBTokenStub = DBToken.FindTokenByRefreshToken &
  DBToken.FindTokenByToken &
  DBToken.FindTokenByUserId &
  DBToken.Delete &
  DBToken.Add

export const MOCK_ACCESS_TOKEN: TokenModel = {
  invalid: false,
  refreshAccessToken: 'any_refresh',
  accessToken: 'any_token',
  user: MOCK_USER
}

export class TokenRepositoryStub implements DBTokenStub {
  async findByToken(_accessTokenToFind: string): Promise<TokenModel | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async findByRefreshToken(
    _accessTokenToFind: string
  ): Promise<TokenModel | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async findByUserId(_userId: string): Promise<TokenModel | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async delete(_accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async add(_params: DBToken.AddParams): Promise<void> {
    await Promise.resolve()
  }
}
