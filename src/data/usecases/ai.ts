export namespace AI {
  export interface ValidateContent {
    validateContent: (title: string, content: string) => Promise<boolean>
  }

  export interface PromptReplyToPost {
    promptReply: (title: string, content: string) => Promise<string>
  }
}
