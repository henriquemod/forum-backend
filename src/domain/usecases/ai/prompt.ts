export namespace Prompt {
  export interface Level {
    level: number
  }

  export interface JSONFromPrompt {
    JSONFromPrompt: <T = Record<string, unknown>>(text: string) => Promise<T>
  }
}
