import { NotFound } from '@/application/errors'
import type { Activation } from '@/data/usecases'
import type { ActivationModel, UserModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'

type ActivationRepository = DBActivation.Create & DBActivation.FindByCode

type ActivationData = Activation.CreateActivationCode &
  Activation.GetUserByActivationCode

export class ActivationManager implements ActivationData {
  constructor(private readonly activationRepository: ActivationRepository) {}

  async getUser(code: string): Promise<UserModel.Model> {
    const activation = await this.activationRepository.findByCode(code)

    if (!activation) {
      throw new NotFound('Activation code not found')
    }

    return activation.user
  }

  async createActivationCode(user: UserModel.Model): Promise<ActivationModel> {
    return await this.activationRepository.create({ user })
  }
}
