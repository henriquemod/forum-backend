import { InternalServerError } from '@/application/errors'
import type { Prompt } from '@/domain/usecases/ai'
import { env } from '@/main/config/env'
import OpenAIModule from 'openai'

export class OpenAI implements Prompt.JSONFromPrompt {
  private readonly openAi?: OpenAIModule

  constructor() {
    if (env.features.openAiApiKey) {
      this.openAi = new OpenAIModule({
        apiKey: env.features.openAiApiKey
      })
    }
  }

  async JSONFromPrompt<T = Record<string, unknown>>(text: string): Promise<T> {
    const chatCompletion = await this.openAi?.chat.completions.create({
      messages: [{ role: 'system', content: text }],
      model: 'gpt-3.5-turbo',
      response_format: { type: 'json_object' }
    })
    const contentResponse = chatCompletion?.choices[0].message.content

    if (!contentResponse) {
      throw new InternalServerError('Error on OpenAI response')
    }

    return JSON.parse(contentResponse)
  }
}
