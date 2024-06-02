import type { ActivationModel, UserModel } from '@/domain/models'

export namespace Activation {
  export interface GetUserByActivationCodeParams {
    code: string
  }
  export interface CreateReturn extends Omit<ActivationModel, 'user'> {
    user: string
  }

  export interface CreateActivationCode {
    createActivationCode: (userId: string) => Promise<CreateReturn>
  }
  export interface GetUserByActivationCode {
    getUser: (code: string) => Promise<UserModel.SafeModel>
  }
}
