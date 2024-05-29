import type { WithDates, UserModel, PostModel } from '.'

export namespace ReplyModel {
  export type Model = WithDates<{
    id: string
    user: UserModel.Model
    content: string
    post: PostModel.Model
    parentReply?: ReplyModel.Model | null
  }>
}
