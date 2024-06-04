export namespace Queue {
  export interface WorkerOptions {
    callback: () => Promise<void>
  }

  export interface Add {
    add: (data: WorkerOptions) => Promise<void>
  }
}
