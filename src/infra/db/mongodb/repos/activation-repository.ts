import type { ActivationModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'
import { ActivationSchema } from '@/infra/db/mongodb/schemas'
import type { ClientSession } from 'mongoose'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

type ActivationDBUsecases = DBActivation.FindByCode & DBActivation.Create

export class ActivationMongoRepository implements ActivationDBUsecases {
  constructor(private readonly session?: ClientSession) {}

  async create(params: DBActivation.CreateParams): Promise<ActivationModel> {
    const activation = new ActivationSchema(
      {
        _id: new mongoose.Types.ObjectId(),
        code: uuidv4(),
        user: params.user
      },
      { session: this.session }
    )

    return await activation.save({ session: this.session })
  }

  async findByCode(code: string): Promise<ActivationModel | null> {
    return await ActivationSchema.findOne({ code }).populate('user')
  }
}
