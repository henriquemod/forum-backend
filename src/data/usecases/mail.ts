export namespace Mail {
  export interface SendActivationMail {
    sendActivationMail: (email: string, activationCode: string) => Promise<void>
  }
}
