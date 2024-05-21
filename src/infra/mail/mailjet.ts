import type { Mail } from '@/data/usecases'
import Mailjet, { type Client } from 'node-mailjet'

const MAILJET_TEMPLATE_ID = 5972199

export class MailjetMailService implements Mail.SendActivationMail {
  private readonly mailjet: Client = Mailjet.apiConnect(
    process.env.MJ_APIKEY_PUBLIC || '1',
    process.env.MJ_APIKEY_PRIVATE || '2'
  )

  async sendActivationMail(email: string): Promise<void> {
    const request = await this.mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'henrique@petqamail.henriquesouza.dev',
              Name: 'Henrique'
            },
            To: [
              {
                Email: email,
                Name: 'passenger 1'
              }
            ],
            TemplateID: MAILJET_TEMPLATE_ID,
            TemplateLanguage: true,
            Variables: {
              name: 'Henrique'
            },
            Subject: 'Your email flight plan!'
          }
        ]
      })

    console.log(request.body)
  }
}
