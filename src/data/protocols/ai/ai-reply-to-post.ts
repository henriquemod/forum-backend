import { InternalServerError } from '@/application/errors'
import type { AI } from '@/data/usecases'
import type { Prompt } from '@/domain/usecases/ai'

type AIData = AI.PromptReplyToPost

interface JsonReplyResponse {
  reply: string
}

export class AIPromptReplyToPost implements AIData {
  private readonly promptReplyTemplate =
    'Imagine you are an expert in the field related to the given text title and content. ' +
    'Your task is to provide a professional and helpful reply. ' +
    'If the topic is about cars, you will assume the role of an expert in cars, mechanics, etc. ' +
    'If the topic involves sensitive issues like healthcare or diseases, you should be an expert doctor. ' +
    'However, do not provide medical advice that requires professional expertise. ' +
    'Instead, recommend that the person seek local help for their specific situation. ' +
    "Your response should be in the form of a JSON file containing a single parameter named 'reply.' " +
    '\n\nThe specific content to be addressed is as follows: \n' +
    "title: '@title', \ncontent: '@content' \nKindly provide your professional and friendly reply based on the aforementioned criteria."

  constructor(private readonly prompt: Prompt.JSONFromPrompt) {}

  private readonly validateReturn = (response: unknown): void => {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('reply' in response) ||
      typeof response.reply !== 'string'
    ) {
      throw new InternalServerError('Error on AI response')
    }
  }

  async promptReply(title: string, content: string): Promise<string> {
    const text = this.promptReplyTemplate
      .replace('@title', title)
      .replace('@content', content)

    const response = await this.prompt.JSONFromPrompt<JsonReplyResponse>(text)

    if (response.type === 'disabled') {
      return ''
    }

    if (response.type === 'error') {
      throw new InternalServerError(response.message)
    }

    this.validateReturn(response.data)

    return response.data.reply
  }
}
