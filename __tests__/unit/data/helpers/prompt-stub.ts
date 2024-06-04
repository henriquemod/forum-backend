import type { Prompt } from '@/domain/usecases/ai'

export class ValidatePromptStub implements Prompt.JSONFromPrompt {
  async JSONFromPrompt<T = Record<string, unknown>>(
    _text: string
  ): Promise<Prompt.JSONPromptResponse<T>> {
    return await Promise.resolve({
      type: 'success',
      data: { level: 10 } as unknown as T
    })
  }
}

export class ReplyToPostPromptStub implements Prompt.JSONFromPrompt {
  async JSONFromPrompt<T = Record<string, unknown>>(
    _text: string
  ): Promise<Prompt.JSONPromptResponse<T>> {
    return await Promise.resolve({
      type: 'success',
      data: { reply: 'This is a test reply' } as unknown as T
    })
  }
}
