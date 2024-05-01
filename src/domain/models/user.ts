export namespace UserModel {
  export enum Level {
    ADMIN = 'admin',
    USER = 'user'
  }

  export interface Model {
    id: string
    username: string
    email: string
    password: string
    level: Level
  }
}
