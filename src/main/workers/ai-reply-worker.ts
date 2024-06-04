/* eslint-disable no-console */
import { type ConnectionOptions, Worker } from 'bullmq'

import { AIPromptReplyToPost } from '@/data/protocols'
import { OpenAI } from '@/infra/ai'
import { BullQMQueue } from '@/infra/queue'

import { makeCreateReplyController } from '../factories/controllers/reply'

export default (connection: ConnectionOptions): void => {
  const worker = new Worker(
    'my-queue',
    async (job) => {
      console.log(`Processing job ${job.id} of type ${job.name}`)
      console.log('Job data:', job.data)

      const aiManager = new AIPromptReplyToPost(new OpenAI())
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

  BullQMQueue.InitializeWorker(
    worker,
    (job, err) => {
      console.error(`Job ${job?.id} failed with error: ${err?.message}`)
    },
    (job) => {
      console.log(`Job ${job.id} completed`)
    }
  )
}
