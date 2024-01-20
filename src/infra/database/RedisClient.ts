import { Redis } from 'ioredis'
import { injectable } from 'tsyringe'
import { env } from '../../main/env'

@injectable()
export class RedisClient {
  constructor(protected readonly cache: Redis) {
    try {
      this.cache = new Redis({
        port: env.redisPort,
        host: env.redisHost,
        password: env.redisPassword,
      })

      this.cache.on('connect', () => {
        console.log('Redis client connected')
      })
    } catch (err) {
      console.error('error connecting to redis: ' + err)
    }
  }

  get(key: string): Promise<string | null> {
    return this.cache.get(key)
  }

  async set(key: string, value: any): Promise<void> {
    await this.cache.set(key, value)
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key)
  }
}