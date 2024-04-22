import type { Token } from '@/data/usecases'

export class TokenStub implements Token.Validate {
  async userHasToken(_userId: string): Promise<boolean> {
    return await Promise.resolve(true)
  }

  async validate(_accessToken: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
