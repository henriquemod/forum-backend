import type {
  AddTokenRepository,
  FindRefreshTokenRepository,
  FindTokenRepository,
  InvalidateTokenRepository
} from '@/data/protocols/db/token'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

export class TokenMongoRepository
  implements
    AddTokenRepository,
    FindTokenRepository,
    FindRefreshTokenRepository,
    InvalidateTokenRepository
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
        accessToken: token.accessToken,
        refreshAccessToken: token.refreshAccessToken,
        invalid: token.invalid,
        user: {
          id: token.userId.id.toString(),
          username: token.userId.username.toString(),
          password: token.userId.password,
          email: token.userId.email
        }
      }
    }
  }

  async findRefreshToken(
    data: FindRefreshTokenRepository.Params
  ): Promise<FindRefreshTokenRepository.Result> {
    const token = await AccessTokenSchema.findOne({
      refreshAccessToken: data.accessRefreshToken,
      invalid: false
    })
      .populate('userId')
      .populate('accessToken')
      .populate('invalid')
      .select('userId')

    if (token) {
      return {
        accessToken: token.accessToken,
        refreshAccessToken: token.refreshAccessToken,
        invalid: token.invalid,
        user: {
          id: token.userId.id.toString(),
          username: token.userId.username.toString(),
          password: token.userId.password,
          email: token.userId.email
        }
      }
    }
  }

  async invalidate(accessToken: string): Promise<undefined> {
    await AccessTokenSchema.findOneAndUpdate({ accessToken }, { invalid: true })
  }
}
