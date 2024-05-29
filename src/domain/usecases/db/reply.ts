import type { PostModel, ReplyModel, UserModel } from '@/domain/models'

export namespace DBReply {
  export interface CreateParams {
    post: PostModel.Model
    user: UserModel.Model
    content: string
  }

  export interface Create {
    create: (params: CreateParams) => Promise<ReplyModel.Model>
  }
}
