/* eslint-disable no-console */
import type { Queue } from '@/data/usecases'
import { type ConnectionOptions, Worker, Queue as BullQueue } from 'bullmq'

export class BullQMQueue implements Queue.Add {
  static async InitializeWorker(connection: ConnectionOptions): Promise<void> {
    const worker = new Worker(
      'my-queue',
      async (job) => {
        console.log(`Processing job ${job.id} of type ${job.name}`)
        console.log('Job data:', job.data)

        // Simulate some processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        console.log(`Job ${job.id} processed`)
      },
      { connection }
    )

    // Handle worker errors
    worker.on('failed', (job, err) => {
      console.error(`Job ${job?.id} failed:`, err)
    })

    worker.on('completed', (job) => {
      console.log(`Job ${job.id} completed`)
    })
  }

  constructor(private readonly connection?: ConnectionOptions) {}

  async add(data: unknown): Promise<void> {
    if (this.connection) {
      const queue = new BullQueue('my-queue', { connection: this.connection })
      await queue.add('ola-mundo', data)
    }
  }
}
