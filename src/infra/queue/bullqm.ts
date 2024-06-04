/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Queue } from '@/data/usecases'
import {
  Queue as BullQueue,
  type ConnectionOptions,
  type Worker,
  type Job
} from 'bullmq'

export class BullQMQueue implements Queue.Add {
  static async InitializeWorker(
    worker: Worker,
    onFailCallback: <T = any>(job?: Job<T>, err?: Error) => void,
    onCompleteCallback: <T = any>(job: Job<T>) => void
  ): Promise<void> {
    worker.on('failed', onFailCallback)
    worker.on('completed', onCompleteCallback)
  }

  constructor(private readonly connection?: ConnectionOptions) {}

  async add(prompt: unknown): Promise<void> {
    if (this.connection) {
      const queue = new BullQueue('my-queue', { connection: this.connection })
      await queue.add('ola-mundo', prompt)
    }
  }
}
