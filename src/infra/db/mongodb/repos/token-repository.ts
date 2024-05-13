import type { AccessTokenModel, TokenModel } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

type TokenDBUsecases = DBToken.FindTokenByToken &
  DBToken.FindTokenByUserId &
  DBToken.FindTokenByRefreshToken &
  DBToken.Add &
  DBToken.Delete

export class TokenMongoRepository implements TokenDBUsecases {
  async add({
    accessToken,
    refreshAccessToken,
    userId
  }: DBToken.AddParams): Promise<void> {
    const token = new AccessTokenSchema({
      accessToken,
      refreshAccessToken,
      user: new mongoose.Types.ObjectId(userId)
    })
    await token.save()
  }

  async findByToken(accessToken: AccessTokenModel): Promise<TokenModel | null> {
    return await AccessTokenSchema.findOne({
      accessToken
    }).populate('user')
  }

  async findByRefreshToken(
    refreshAccessToken: AccessTokenModel
  ): Promise<TokenModel | null> {
    return await AccessTokenSchema.findOne({
      refreshAccessToken
    }).populate('user')
  }

  async findByUserId(userId: string): Promise<TokenModel | null> {
    const user = new mongoose.Types.ObjectId(userId)
    return await AccessTokenSchema.findOne({ user }).populate('user')
  }

  async delete(accessToken: string): Promise<undefined> {
    await AccessTokenSchema.deleteOne({ accessToken })
  }
}
