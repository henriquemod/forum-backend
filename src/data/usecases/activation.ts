import type { ActivationModel } from '@/domain/models'

export namespace Activation {
  export interface CreateActivationCode {
    createActivationCode: (userId: string) => Promise<ActivationModel>
  }
}
