import type { AI } from '@/data/usecases/'

export class AiStub implements AI.ValidateContent, AI.PromptReplyToPost {
  async promptReply(_title: string, _content: string): Promise<string> {
    return await Promise.resolve('any_reply')
  }

  async validateContent(_title: string, _content: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
