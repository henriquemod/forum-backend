import type { WithDates } from './helpers'
import type { UserModel } from './user'

export type ActivationModel = WithDates<{
  code: string
  user: UserModel.Model
}>
