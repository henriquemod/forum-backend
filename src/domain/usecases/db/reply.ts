import type { PostModel, ReplyModel, UserModel } from '@/domain/models'

export namespace DBReply {
  export interface CreateParams {
    post: PostModel.Model
    user: UserModel.SafeModel
    parentReply: ReplyModel.Model | null
    content: string
  }

  export interface Create {
    create: (params: CreateParams) => Promise<ReplyModel.Model>
  }

  export interface FindById {
    findById: (replyId: string) => Promise<ReplyModel.Model | null>
  }
}
