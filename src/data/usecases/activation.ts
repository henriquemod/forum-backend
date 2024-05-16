import type { ActivationModel, UserModel } from '@/domain/models'

export namespace Activation {
  export interface GetUserByActivationCodeParams {
    code: string
  }
  export interface CreateActivationCode {
    createActivationCode: (userId: string) => Promise<ActivationModel>
  }
  export interface GetUserByActivationCode {
    getUser: (params: GetUserByActivationCodeParams) => Promise<UserModel.Model>
  }
}
