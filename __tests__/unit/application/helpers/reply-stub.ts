import type { Reply } from '@/data/usecases/'

export class ReplyStub implements Reply.ReplyPost {
  async reply(_params: Reply.ReplyPostParams): Promise<void> {}
}
