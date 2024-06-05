import type { Queue } from '@/data/usecases/'

export class QueueStub implements Queue.Add {
  async add<T>(_params: Queue.AddParams<T>): Promise<void> {}
}
