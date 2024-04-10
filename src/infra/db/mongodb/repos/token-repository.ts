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
      invalid: false,
      userId: new mongoose.Types.ObjectId(userId)
    })
    await token.save()
  }

  async findByToken(
    accessToken: AccessToken
  ): Promise<Token.FindResult | undefined> {
    const token = await AccessTokenSchema.findOne({
      accessToken,
      invalid: false
    })
      .populate('userId')
      .populate('accessToken')
      .populate('invalid')
      .select('userId')

    if (token) {
      return {
        accessToken: token.accessToken,
        id: token.userId.id.toString(),
        username: token.userId.username.toString(),
        password: token.userId.password,
        email: token.userId.email
      }
    }
  }

  async findByRefreshToken(
    refreshAccessToken: AccessToken
  ): Promise<Token.FindResult | undefined> {
    const token = await AccessTokenSchema.findOne({
      refreshAccessToken,
      invalid: false
    })
      .populate('userId')
      .populate('accessToken')
      .populate('invalid')
      .select('userId')

    if (token) {
      return {
        accessToken: token.accessToken,
        id: token.userId.id.toString(),
        username: token.userId.username.toString(),
        password: token.userId.password,
        email: token.userId.email
      }
    }
  }

  async invalidate(accessToken: string): Promise<undefined> {
    await AccessTokenSchema.findOneAndUpdate({ accessToken }, { invalid: true })
  }
}
