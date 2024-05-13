import type { WithDates } from '.'

export namespace UserModel {
  export enum Level {
    ADMIN = 'admin',
    USER = 'user'
  }

  export type Model = WithDates<{
    id: string
    username: string
    email: string
    password: string
    level: Level
  }>
}
