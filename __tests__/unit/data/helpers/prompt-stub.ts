import type { Prompt } from '@/domain/usecases/ai'

export class PromptStub implements Prompt.JSONFromPrompt {
  async JSONFromPrompt<T = Record<string, unknown>>(text: string): Promise<T> {
    return await Promise.resolve({ level: 10 } as unknown as T)
  }
}
