import type { RedisOptions } from 'ioredis'

export const makeRedisConnection = (): RedisOptions | undefined => {
  if (process.env.NODE_ENV !== 'test') {
    const redisOptions: RedisOptions = {
      host: 'localhost',
      port: 6379
    }

    return redisOptions
  }
}
