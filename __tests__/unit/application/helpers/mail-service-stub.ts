import type { Mail } from '@/data/usecases'

export class MailServiceStub implements Mail.SendActivationMail {
  async sendActivationMail(_email: string): Promise<void> {}
}
