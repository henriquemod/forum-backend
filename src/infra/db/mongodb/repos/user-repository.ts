import type { Hash } from '@/data/usecases/encryption'
import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'
import { UserSchema } from '@/infra/db/mongodb/schemas'

export class UserMongoRepository implements DBUser.Add, DBUser.Find {
  constructor(private readonly hash: Hash.Generate) {}

  async add({
    username,
    email,
    password
  }: Omit<UserModel, 'id'>): Promise<DBUser.AddResult> {
    const hashedPassword = await this.hash.generate(password)

    const accessToken = new UserSchema({
      username,
      email,
      password: hashedPassword
    })

    const { id } = await accessToken.save()

    return {
      id
    }
  }

  async findByEmail(email: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      email
    })
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      username
    })
  }

  async findByUserId(id: string): Promise<UserModel | null> {
    return await UserSchema.findOne({
      _id: id
    })
  }
}
