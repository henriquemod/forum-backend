import type { WithDates, UserModel } from '.'

export namespace PostModel {
  export type Model = WithDates<{
    id: string
    user: UserModel.Model
    title: string
    content: string
  }>
}
