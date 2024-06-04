/* eslint-disable no-console */
import { type ConnectionOptions, Worker } from 'bullmq'

import { AIPromptReplyToPost } from '@/data/protocols'
import { Queue } from '@/data/usecases'
import { OpenAI } from '@/infra/ai'
import { BullQMQueue } from '@/infra/queue'

import { makeCreateReplyController } from '../factories/controllers/reply'
import { makeUserRepository } from '../factories/repositories'

export default (connection: ConnectionOptions): void => {
  const worker = new Worker(
    Queue.Name.REPLY_TO_POST,
    async (job) => {
      const aiManager = new AIPromptReplyToPost(new OpenAI())
      const userRepository = makeUserRepository()
      const controller = makeCreateReplyController()

      const aiUser = await userRepository.findByUsername('ai-assistant', true)

      if (!aiUser) return

      const aiGeneratedReply = await aiManager.promptReply(
        job.data.title as string,
        job.data.content as string
      )

      if (!aiGeneratedReply) return

      await controller.handle({
        content: aiGeneratedReply,
        postId: job.data.id,
        userId: aiUser.id
      })
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
