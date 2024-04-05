import type { AddTokenRepository } from '@/data/protocols/db/token'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas/token'
import mongoose from 'mongoose'

export class TokenMongoRepository implements AddTokenRepository {
  async add(
    data: AddTokenRepository.Params
  ): Promise<AddTokenRepository.Result> {
    const accessToken = new AccessTokenSchema({
      token: data.token,
      userId: new mongoose.Types.ObjectId(data.userId)
    })
    await accessToken.save()
  }
}
