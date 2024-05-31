import type { ReplyModel } from '@/domain/models'

export namespace Reply {
  export interface ReplyPostParams {
    postId: string
    authorId: string
    replyContentId?: string
    content: string
  }
  export interface ReplyPost {
    reply: (params: ReplyPostParams) => Promise<void>
  }

  export interface DeleteParams {
    userId: string
    replyId: string
  }

  export interface Delete {
    delete: (params: DeleteParams) => Promise<void>
  }

  export interface FindByIdParams {
    replyId: string
  }

  export interface FindById {
    findById: (params: FindByIdParams) => Promise<ReplyModel.Model>
  }
}
