import { NotFound } from '@/application/errors'
import type { Activation } from '@/data/usecases'
import type { ActivationModel } from '@/domain/models'
import type { DBActivation, DBUser } from '@/domain/usecases/db'

type ActivationRepository = DBActivation.Create & DBActivation.FindByCode
type UserRepository = DBUser.FindUserByUserId

type ActivationData = Activation.CreateActivationCode

export class ActivationManager implements ActivationData {
  constructor(
    private readonly activationRepository: ActivationRepository,
    private readonly userRepository: UserRepository
  ) {}

  async createActivationCode(userId: string): Promise<ActivationModel> {
    const user = await this.userRepository.findByUserId(userId)

    if (!user) {
      throw new NotFound('User not found')
    }

    return await this.activationRepository.create({ user })
  }
}
