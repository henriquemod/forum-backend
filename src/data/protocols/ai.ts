import { InternalServerError } from '@/application/errors'
import type { AI } from '@/data/usecases'
import type { Prompt } from '@/domain/usecases/ai'
import { env } from '@/main/config/env'

type AIData = AI.ValidateContent
interface JsonResponse {
  level: number
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

  constructor(private readonly prompt: Prompt.JSONFromPrompt) {}

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
