export namespace AI {
  export interface ValidateContent {
    validateContent: (title: string, content: string) => Promise<boolean>
  }
}
