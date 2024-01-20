export const env = {
  ordersApiUrl: process.env.ORDERS_API_URL || '',
  port: process.env.PORT || 3000,
  redisPort: parseInt(process.env.REDIS_PORT || '6379', 10),
  redisHost: process.env.REDIS_HOST || '',
  redisPassword: process.env.REDIS_PASSWORD || '',
}