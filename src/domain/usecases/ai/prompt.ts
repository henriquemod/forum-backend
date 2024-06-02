export namespace Prompt {
  export interface Level {
    level: number
  }

  export type JSONPromptResponse<T = Record<string, unknown>> =
    | {
        type: 'success'
        data: T
      }
    | {
        type: 'disabled'
      }
    | {
        type: 'error'
        message: string
      }

  export interface JSONFromPrompt {
    JSONFromPrompt: <T = Record<string, unknown>>(
      text: string
    ) => Promise<JSONPromptResponse<T>>
  }
}
