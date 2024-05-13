export type WithDates<T> = {
  createdAt: Date
  updatedAt: Date
} & T
