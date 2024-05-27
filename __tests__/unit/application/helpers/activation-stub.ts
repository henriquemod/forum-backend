import type { Activation } from '@/data/usecases'
import type { ActivationModel, UserModel } from '@/domain/models'
import { MOCK_USER } from './user-stub'

export class ActivationStub
  implements
    Activation.CreateActivationCode,
    Activation.GetUserByActivationCode
{
  async getUser(code: string): Promise<UserModel.Model> {
    return MOCK_USER
  }

  async createActivationCode(user: UserModel.Model): Promise<ActivationModel> {
    return {
      code: 'any_code',
      user: MOCK_USER,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
