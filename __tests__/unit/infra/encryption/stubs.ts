import { type TokenModel, UserModel } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db'

type UserRepository = DBToken.Delete &
  DBToken.FindTokenByRefreshToken &
  DBToken.FindTokenByToken &
  DBToken.FindTokenByUserId

export class UserRepositoryStub implements UserRepository {
  async delete(_accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async findByToken(_accessTokenToFind: string): Promise<TokenModel | null> {
    return await Promise.resolve({
      invalid: false,
      refreshAccessToken: 'any_refresh',
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password',
        level: UserModel.Level.USER,
        verifiedEmail: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async findByRefreshToken(
    _accessTokenToFind: string
  ): Promise<TokenModel | null> {
    return await Promise.resolve({
      invalid: false,
      refreshAccessToken: 'any_refresh',
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password',
        level: UserModel.Level.USER,
        verifiedEmail: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }

  async findByUserId(_userId: string): Promise<TokenModel | null> {
    return await Promise.resolve({
      invalid: false,
      refreshAccessToken: 'any_refresh',
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password',
        level: UserModel.Level.USER,
        verifiedEmail: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  }
}
