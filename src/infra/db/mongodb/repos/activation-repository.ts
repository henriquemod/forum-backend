import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import type { ActivationModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'
import { ActivationSchema } from '@/infra/db/mongodb/schemas'

type ActivationDBUsecases = DBActivation.FindByCode & DBActivation.Create

export class ActivationMongoRepository implements ActivationDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  async create(
    params: DBActivation.CreateParams
  ): Promise<DBActivation.CreateReturn> {
    const userId = new mongoose.Types.ObjectId(params.userId)
    const activation = new ActivationSchema(
      {
        _id: new mongoose.Types.ObjectId(),
        code: uuidv4(),
        user: userId
      },
      { session: this.session }
    )

    await activation.save({ session: this.session })

    const activationDTO = activation.toObject()

    return {
      id: activationDTO._id.toString(),
      code: activationDTO.code,
      user: userId.toString(),
      createdAt: activationDTO.createdAt,
      updatedAt: activationDTO.updatedAt
    }
  }

  async findByCode(code: string): Promise<ActivationModel | null> {
    return await ActivationSchema.findOne({ code }).populate('user')
  }
}
