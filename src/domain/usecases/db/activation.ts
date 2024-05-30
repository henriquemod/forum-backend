import type { ActivationModel } from '@/domain/models'

export namespace DBActivation {
  export interface CreateParams {
    userId: string
  }
  export type CreateReturn = Omit<ActivationModel, 'user'> & { user: string }

  export interface Create {
    create: (params: CreateParams) => Promise<CreateReturn>
  }
  export interface FindByCode {
    findByCode: (code: string) => Promise<ActivationModel | null>
  }
}
