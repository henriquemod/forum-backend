import type { RedisOptions } from 'ioredis'

export const makeRedisConnection = (): RedisOptions => {
  const redisOptions: RedisOptions = {
    host: '127.0.0.1',
    port: 6379
  }

  return redisOptions
}
