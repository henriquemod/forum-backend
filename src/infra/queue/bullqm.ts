/* eslint-disable no-console */
import type { Queue } from '@/data/usecases'
import { Queue as BullQueue, type ConnectionOptions, type Worker } from 'bullmq'

export class BullQMQueue implements Queue.Add {
  static async InitializeWorker(worker: Worker): Promise<void> {
    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err)
    })

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`)
    })
  }

  constructor(private readonly connection?: ConnectionOptions) {}

  async add(prompt: unknown): Promise<void> {
    if (this.connection) {
      const queue = new BullQueue('my-queue', { connection: this.connection })
      await queue.add('ola-mundo', prompt)
    }
  }
}
