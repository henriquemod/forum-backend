import type { WithDates, UserModel, ReplyModel } from '.'

export namespace PostModel {
  export type Model = WithDates<{
    id: string
    user: UserModel.Model
    title: string
    content: string
    replies?: ReplyModel.Model[]
  }>
}
