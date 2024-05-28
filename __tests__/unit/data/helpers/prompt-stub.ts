import type { Prompt, PromptLevel } from '@/domain/usecases/ai'

export class PromptStub implements Prompt {
  async prompt(text: string): Promise<PromptLevel> {
    return await Promise.resolve({ level: 10 })
  }
}
