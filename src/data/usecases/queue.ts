export namespace Queue {
  export interface WorkerOptions {
    callback: () => Promise<void>
  }

  export interface AddParams<T> {
    queueName: Queue.Name
    taskName: string
    content: T
  }

  export interface Add {
    add: <T>(params: AddParams<T>) => Promise<void>
  }

  export enum Name {
    REPLY_TO_POST = 'reply-to-post'
  }
}
