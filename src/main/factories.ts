import { container } from 'tsyringe'
import { RedisClient } from '../infra/database/RedisClient'

export async function initializeContainer() {
  container.registerSingleton('RedisClient', RedisClient)
}