/* eslint-disable no-console */
import { v4 as uuid } from 'uuid'

import { UserModel } from '@/domain/models'
import { BCryptHash } from '@/infra/encryption'

import { UserSchema } from '../../schemas'

const userToSeed: Array<
  Omit<UserModel.Model, 'id' | 'createdAt' | 'updatedAt'>
> = [
  {
    username: 'admin',
    email: 'admin@admin.com',
    password: 'admin',
    level: UserModel.Level.MASTER,
    verifiedEmail: true
  },
  {
    username: 'ai-assistant',
    email: 'ai-assistant@forum.com',
    password: uuid(),
    level: UserModel.Level.USER,
    verifiedEmail: true
  }
]

export default async () => {
  console.log('Seeding users...')
  const hash = new BCryptHash()
  await Promise.all(
    userToSeed.map(async (user) => {
      await UserSchema.findOneAndDelete({
        username: user.username
      })

      const password = await hash.generate(user.password)

      await UserSchema.create({
        ...user,
        password
      })

      console.log(`User ${user.username} seeded!`)
    })
  )
}
