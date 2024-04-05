import { MongoClient, type Collection } from 'mongodb'

interface MongoHelperProps {
  client: MongoClient | null
  uri: string

  connect: (uri: string) => Promise<void>
  disconnect: () => Promise<void>
  getCollection: (name: string) => Collection
  map: (data: any) => any
  mapCollection: (collection: any[]) => any[]
}

export const MongoHelper: MongoHelperProps = {
  client: null as unknown as MongoClient,
  uri: null as unknown as string,

  async connect(uri: string): Promise<void> {
    this.uri = uri
    this.client = await MongoClient.connect(uri)
  },

  async disconnect(): Promise<void> {
    await this.client?.close()
    this.client = null
  },

  getCollection(name: string): Collection {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.client!.db().collection(name)
  },

  map: (data: any): any => {
    const { _id, ...rest } = data
    return { ...rest, id: _id.toHexString() }
  },

  mapCollection: (collection: any[]): any[] => {
    return collection.map((c) => MongoHelper.map(c))
  }
}
