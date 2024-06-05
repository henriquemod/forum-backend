import OpenAIModule from 'openai'

import type { Prompt } from '@/domain/usecases/ai'
import { env } from '@/main/config/env'

export class OpenAI implements Prompt.JSONFromPrompt {
  private readonly openAi?: OpenAIModule

  constructor() {
    if (env.features.openAiApiKey) {
      this.openAi = new OpenAIModule({
        apiKey: env.features.openAiApiKey
      })
    }
  }

  async JSONFromPrompt<T = Record<string, unknown>>(
    text: string
  ): Promise<Prompt.JSONPromptResponse<T>> {
    if (!this.openAi) {
      return { type: 'disabled' }
    }

    const chatCompletion = await this.openAi?.chat.completions.create({
      messages: [{ role: 'system', content: text }],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' }
    })
    const contentResponse = chatCompletion?.choices[0].message.content

    if (!contentResponse) {
      return {
        type: 'error',
        message: 'Error on OpenAI response'
      }
    }

    return {
      type: 'success',
      data: JSON.parse(contentResponse)
    }
  }
}
