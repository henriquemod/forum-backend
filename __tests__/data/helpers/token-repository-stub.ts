import type { DBToken } from '@/domain/usecases/db'
import { MOCK_USER } from './user-repository-stub'
import type { TokenModel } from '@/domain/models'

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
  async findByToken(accessTokenToFind: string): Promise<TokenModel | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async findByRefreshToken(
    accessTokenToFind: string
  ): Promise<TokenModel | null> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: string): Promise<TokenModel | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async delete(accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async add(params: DBToken.AddParams): Promise<void> {
    await Promise.resolve()
  }
}
