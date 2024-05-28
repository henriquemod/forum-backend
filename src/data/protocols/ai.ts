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
    'Assume the role of an API system and your job is to analise an text title ' +
    'and content and determine its level (between 1-10) of acceptance, the content ' +
    'should be level 1 for unacceptable, something that is no accepted by society ' +
    'now days, which mean any content that could harm or offend people, and 10 ' +
    'something completely acceptable and in accord of what society judge ok, ' +
    "your reply should be an json file that has only one param called 'level'. " +
    "\nThe content you will analise is: \ntitle: '@title', " +
    "content: '@content' Give me you result on that"

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

    this.validateReturn(response)

    return response.level >= this.promptLevel
  }
}
