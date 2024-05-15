export namespace Mail {
  export interface SendActivationMail {
    sendActivationMail: (email: string) => Promise<void>
  }
}
