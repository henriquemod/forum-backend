import type { AI } from '@/data/usecases/'

export class AiStub implements AI.ValidateContent {
  async validateContent(title: string, content: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}
