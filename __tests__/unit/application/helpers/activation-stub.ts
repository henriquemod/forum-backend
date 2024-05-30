import type { Activation } from '@/data/usecases'
import type { UserModel } from '@/domain/models'
import { MOCK_USER } from './user-stub'

export class ActivationStub
  implements
    Activation.CreateActivationCode,
    Activation.GetUserByActivationCode
{
  async getUser(code: string): Promise<UserModel.Model> {
    return MOCK_USER
  }

  async createActivationCode(
    _userId: string
  ): Promise<Activation.CreateReturn> {
    return {
      id: 'any_id',
      code: 'any_code',
      user: MOCK_USER.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
