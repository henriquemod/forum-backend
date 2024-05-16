import type { Mail } from '@/data/usecases'
import Mailgun from 'mailgun.js'

export class MailgunMailService implements Mail.SendActivationMail {
  private readonly mailgun: Mailgun = new Mailgun(FormData)

  async sendActivationMail(email: string): Promise<void> {
    const mg = this.mailgun.client({
      username: 'api',
      key:
        process.env.MAILGUN_API_KEY ||
        'f3b493cd0c2571aacf3635ada8fadea3-32a0fef1-c2dc20e9'
    })
    const message = await mg.messages.create('petqa.henriquesouza.dev', {
      from: 'Henrique Souza <henrique@petqa.henriquesouza.dev>',
      to: ['email@yahoo.com'],
      subject: 'Hello',
      text: 'Testing some Mailgun awesomeness!',
      html: '<h1>Testing some Mailgun awesomeness!</h1>'
    })
    console.log(message)
  }
}
