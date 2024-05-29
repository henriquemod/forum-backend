export namespace Reply {
  export interface ReplyPostParams {
    postId: string
    authorId: string
    content: string
  }
  export interface ReplyPost {
    reply: (params: ReplyPostParams) => Promise<void>
  }
}
