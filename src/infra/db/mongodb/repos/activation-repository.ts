import type { ActivationModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'
import { ActivationSchema } from '@/infra/db/mongodb/schemas'
import { v4 as uuidv4 } from 'uuid'

type ActivationDBUsecases = DBActivation.FindByCode & DBActivation.Create

export class ActivationMongoRepository implements ActivationDBUsecases {
  async create(params: DBActivation.CreateParams): Promise<ActivationModel> {
    return await ActivationSchema.create({
      code: uuidv4(),
      user: params.user
    })
  }

  async findByCode(code: string): Promise<ActivationModel | null> {
    return await ActivationSchema.findOne({ code }).populate('user')
  }
}
