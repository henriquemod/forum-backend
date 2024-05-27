import type { ActivationModel, UserModel } from '@/domain/models'

export namespace Activation {
  export interface GetUserByActivationCodeParams {
    code: string
  }
  export interface CreateActivationCode {
    createActivationCode: (user: UserModel.Model) => Promise<ActivationModel>
  }
  export interface GetUserByActivationCode {
    getUser: (code: string) => Promise<UserModel.Model>
  }
}
