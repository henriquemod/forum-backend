import type {
  AddTokenRepository,
  FindTokenRepository
} from '@/data/protocols/db/token'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

export class TokenMongoRepository
  implements AddTokenRepository, FindTokenRepository
{
  async add(
    data: AddTokenRepository.Params
  ): Promise<AddTokenRepository.Result> {
    const accessToken = new AccessTokenSchema({
      accessToken: data.accessToken,
      refreshAccessToken: data.refreshAccessToken,
      invalid: false,
      userId: new mongoose.Types.ObjectId(data.userId)
    })
    await accessToken.save()
  }

  async find(
    data: FindTokenRepository.Params
  ): Promise<FindTokenRepository.Result> {
    const token = await AccessTokenSchema.findOne({
      accessToken: data.accessToken,
      invalid: false
    })
      .populate('userId')
      .populate('accessToken')
      .populate('invalid')
      .select('userId')

    if (token) {
      return {
        userId: token.userId.id.toString()
      }
    }
  }
}
