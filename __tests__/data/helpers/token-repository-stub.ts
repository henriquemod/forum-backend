import type { DBToken } from '@/domain/usecases/db'
import { MOCK_USER } from './user-repository-stub'

export type DBTokenStub = DBToken.Find & DBToken.Delete & DBToken.Add

export const MOCK_ACCESS_TOKEN = {
  accessToken: 'any_token',
  user: MOCK_USER
}

export class TokenRepositoryStub implements DBTokenStub {
  async findByToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async findByRefreshToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    throw new Error('Method not implemented.')
  }

  async findByUserId(userId: string): Promise<DBToken.FindResult | null> {
    return await Promise.resolve(MOCK_ACCESS_TOKEN)
  }

  async delete(accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async add(params: DBToken.AddParams): Promise<void> {
    await Promise.resolve()
  }
}
