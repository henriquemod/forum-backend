import { InternalServerError } from '@/application/errors'
import type { AI } from '@/data/usecases'
import type { Prompt } from '@/domain/usecases/ai'
import { env } from '@/main/config/env'

type AIData = AI.ValidateContent & AI.PromptReplyToPost
interface JsonResponse {
  level: number
}

interface JsonReplyResponse {
  reply: string
}

export class AIManager implements AIData {
  private readonly promptLevel: number = env.features.aiAcceptanceLevel
  private readonly promptTemplate =
    'Imagine you are an API system tasked with evaluating the acceptability level (ranging from 1 to 10) of a given text title and content. ' +
    'A level 1 indicates content that is deemed unacceptable by contemporary societal standards, encompassing any material that may cause harm or offense. ' +
    'Conversely, a level 10 signifies content that is entirely acceptable and aligns with societal norms. ' +
    "Your response should be in the form of a JSON file containing a single parameter named 'level.' " +
    '\n\nThe specific content to be assessed is as follows: \n' +
    "title: '@title', \ncontent: '@content' \nKindly provide your assessment based on the aforementioned criteria."

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

    return response.data.reply
  }

  private readonly validateReturn = (response: unknown): void => {
    if (
      typeof response !== 'object' ||
      response === null ||
      !('level' in response) ||
      typeof response.level !== 'number'
    ) {
      throw new InternalServerError('Error on AI response')
    }
  }

  async validateContent(title: string, content: string): Promise<boolean> {
    const text = this.promptTemplate
      .replace('@title', title)
      .replace('@content', content)

    const response = await this.prompt.JSONFromPrompt<JsonResponse>(text)

    if (response.type === 'disabled') {
      return true
    }

    if (response.type === 'error') {
      throw new InternalServerError(response.message)
    }

    this.validateReturn(response.data)

    return response.data.level >= this.promptLevel
  }
}
