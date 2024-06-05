import type { RedisOptions } from 'ioredis'

export const makeRedisConnection = (): RedisOptions => {
  const redisOptions: RedisOptions = {
    host: 'localhost',
    port: 6379
  }

  return redisOptions
}
