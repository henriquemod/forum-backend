import type { AI } from '@/data/usecases/'

export class AiStub implements AI.ValidateContent, AI.PromptReplyToPost {
  async promptReply(title: string, content: string): Promise<string> {
    return await Promise.resolve('any_reply')
  }

  async validateContent(title: string, content: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
