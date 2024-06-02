import type { WithDates } from './helpers'
import type { UserModel } from './user'

export type ActivationModel = WithDates<{
  id: string
  code: string
  user: UserModel.SafeModel
}>
