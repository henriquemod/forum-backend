import type { ActivationModel } from '@/domain/models'
import type { DBActivation } from '@/domain/usecases/db'
import { MOCK_USER } from './user-repository-stub'

export const MOCK_ACTIVATION = {
  id: 'any_id',
  code: 'any_code',
  user: MOCK_USER.id,
  createdAt: new Date(),
  updatedAt: new Date()
}

export type DBActivationStub = DBActivation.Create & DBActivation.FindByCode

export class ActivationRepositoryStub implements DBActivationStub {
  async create(
    params: DBActivation.CreateParams
  ): Promise<DBActivation.CreateReturn> {
    return Object.assign({}, MOCK_ACTIVATION, { user: params.userId })
  }

  async findByCode(code: string): Promise<ActivationModel | null> {
    return Object.assign({}, MOCK_ACTIVATION, { user: MOCK_USER })
  }
}
