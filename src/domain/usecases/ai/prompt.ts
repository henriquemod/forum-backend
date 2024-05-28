export interface PromptLevel {
  level: number
}

export interface Prompt {
  prompt: (text: string) => Promise<PromptLevel>
}
