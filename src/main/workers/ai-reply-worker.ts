/* eslint-disable no-console */
import { AIManager } from '@/data/protocols'
import { OpenAI } from '@/infra/ai'
import { BullQMQueue } from '@/infra/queue/bullqm'
import { type ConnectionOptions, Worker } from 'bullmq'
import { makeCreateReplyController } from '../factories/controllers/reply'

export default (connection: ConnectionOptions): void => {
  const worker = new Worker(
    'my-queue',
    async (job) => {
      console.log(`Processing job ${job.id} of type ${job.name}`)
      console.log('Job data:', job.data)

      const aiManager = new AIManager(new OpenAI())
      const controller = makeCreateReplyController()

      const aiGeneratedReply = await aiManager.promptReply(
        job.data.title as string,
        job.data.content as string
      )

      if (aiGeneratedReply) {
        await controller.handle({
          content: aiGeneratedReply,
          postId: job.data.id,
          userId: job.data.user.id
        })
      }

      console.log(`Job ${job.id} processed`)
    },
    { connection }
  )

  BullQMQueue.InitializeWorker(worker)
}
