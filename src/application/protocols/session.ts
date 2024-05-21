export interface Session {
  startTransaction: () => void
  commitTransaction: () => Promise<void>
  abortTransaction: () => Promise<void>
}
