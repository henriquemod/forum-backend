import {
  Queue as BullQueue,
  type ConnectionOptions,
  type Worker,
  type Job
} from 'bullmq'

import type { Queue } from '@/data/usecases'

export class BullQMQueue implements Queue.Add {
  constructor(private readonly connection?: ConnectionOptions) {}

  static async InitializeWorker(
    worker: Worker,
    onFailCallback: <T = unknown>(job?: Job<T>, err?: Error) => void,
    onCompleteCallback: <T = unknown>(job: Job<T>) => void
  ): Promise<void> {
    worker.on('failed', onFailCallback)
    worker.on('completed', onCompleteCallback)
  }

  async add<T>({
    queueName,
    taskName,
    content
  }: Queue.AddParams<T>): Promise<void> {
    if (this.connection) {
      const queue = new BullQueue(queueName, { connection: this.connection })
      await queue.add(taskName, content)
    }
  }
}
