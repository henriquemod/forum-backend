import type { Mail } from '@/data/usecases'

export class MailServiceStub implements Mail.SendActivationMail {
  async sendActivationMail(email: string): Promise<void> {}
}
