import type { ActivationModel, UserModel } from '@/domain/models'

export namespace DBActivation {
  export interface CreateParams {
    user: UserModel.Model
  }
  export interface Create {
    create: (params: CreateParams) => Promise<ActivationModel>
  }
  export interface FindByCode {
    findByCode: (code: string) => Promise<ActivationModel | null>
  }
}
