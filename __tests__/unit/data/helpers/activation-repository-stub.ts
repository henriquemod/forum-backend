import type { ActivationModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'
import { MOCK_USER } from './user-repository-stub'

export const MOCK_ACTIVATION: ActivationModel = {
  code: 'any_code',
  user: MOCK_USER,
  createdAt: new Date(),
  updatedAt: new Date()
}

export type DBActivationStub = DBActivation.Create & DBActivation.FindByCode

export class ActivationRepositoryStub implements DBActivationStub {
  async create(params: DBActivation.CreateParams): Promise<ActivationModel> {
    return MOCK_ACTIVATION
  }

  async findByCode(code: string): Promise<ActivationModel | null> {
    return MOCK_ACTIVATION
  }
}
