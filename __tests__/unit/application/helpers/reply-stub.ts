import type { Reply } from '@/data/usecases/'

export class ReplyStub implements Reply.ReplyPost, Reply.Delete {
  async delete(params: Reply.DeleteParams): Promise<void> {}
  async reply(_params: Reply.ReplyPostParams): Promise<void> {}
}
