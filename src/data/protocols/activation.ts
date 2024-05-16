import { NotFound } from '@/application/errors'
import type { Activation } from '@/data/usecases'
import type { ActivationModel, UserModel } from '@/domain/models'
import type { DBActivation, DBUser } from '@/domain/usecases/db'

type ActivationRepository = DBActivation.Create & DBActivation.FindByCode
type UserRepository = DBUser.FindUserByUserId

type ActivationData = Activation.CreateActivationCode &
  Activation.GetUserByActivationCode

export class ActivationManager implements ActivationData {
  constructor(
    private readonly activationRepository: ActivationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async getUser(
    params: Activation.GetUserByActivationCodeParams
  ): Promise<UserModel.Model> {
    const activation = await this.activationRepository.findByCode(params.code)

    if (!activation) {
      throw new NotFound('Activation code not found')
    }

    return activation.user
  }

  async createActivationCode(userId: string): Promise<ActivationModel> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new NotFound('User not found')
    }

    return await this.activationRepository.create({ user })
  }
}
