import type { Token } from '@/data/protocols/db'
import type { AccessToken } from '@/domain/models'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

export class TokenMongoRepository
  implements Token.Add, Token.Find, Token.Invalidate
{
  async add({
    accessToken,
    refreshAccessToken,
    userId
  }: Token.AddParams): Promise<void> {
    const token = new AccessTokenSchema({
      accessToken,
      refreshAccessToken,
      user: new mongoose.Types.ObjectId(userId)
    })
    await token.save()
  }

  async findByToken(
    accessToken: AccessToken
  ): Promise<Token.FindResult | null> {
    return await AccessTokenSchema.findOne({
      accessToken
    }).populate('user')
  }

  async findByRefreshToken(
    refreshAccessToken: AccessToken
  ): Promise<Token.FindResult | null> {
    return await AccessTokenSchema.findOne({
      refreshAccessToken
    }).populate('user')
  }

  async invalidate(accessToken: string): Promise<undefined> {
    await AccessTokenSchema.deleteOne({ accessToken })
  }
}
