import type { Token } from '@/data/usecases'
import type { User } from '@/domain/models'

export type JWTStub = Token.SignIn

export class JWTManagerStub implements JWTStub {
  async signIn(user: User): Promise<Token.SignResult> {
    return await Promise.resolve({
      accessToken: 'any_token',
      refreshAccessToken: 'any_token',
      userId: 'any_id'
    })
  }
}
