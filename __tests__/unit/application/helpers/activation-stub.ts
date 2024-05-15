import type { Activation } from '@/data/usecases'
import type { ActivationModel } from '@/domain/models'
import { MOCK_USER } from './user-stub'

export class ActivationStub implements Activation.CreateActivationCode {
  async createActivationCode(code: string): Promise<ActivationModel> {
    return {
      code: 'any_code',
      user: MOCK_USER,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}
