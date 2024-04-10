import type { User } from '@/domain/models'

export interface FindUserByEmail {
  findByEmail: (email: string) => Promise<User>
}

export interface FindUserByUsername {
  findByUsername: (username: string) => Promise<User>
}
