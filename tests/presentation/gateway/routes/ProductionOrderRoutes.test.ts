import 'reflect-metadata'
import request from 'supertest'
import RedisMemoryServer from 'redis-memory-server'
import { Server } from 'http'

import { startHttpServer } from '../../../../src/presentation/gateway/httpServer'
import { initializeContainer } from '../../../../src/main/factories'
import { Redis } from 'ioredis'
import { ProductionOrder, Status } from '../../../../src/domain/entities/ProductionOrder'
import { ProductionOrderProduct } from '../../../../src/domain/entities/ProductionOrderProduct'

jest.mock('../../../../src/infra/http/HttpService', () => {
  return {
    __esModule: true, // this property makes it work
    HttpService: jest.fn().mockImplementation(() => {
      return {
        get: jest.fn(),
        patch: jest.fn().mockResolvedValue({ status: 200, data: {} }),
        axiosInstance: {
          get: jest.fn(),
          patch: jest.fn(),
        } as any
      }
    })
  }
})

describe('ProductionOrderRoutes', () => {
  let redisMemoryServer: RedisMemoryServer
  let server: Server
  let redisConnection: Redis

  beforeAll(async () => {
    redisMemoryServer = new RedisMemoryServer({ instance: { port: 6379 } })
    await redisMemoryServer.start()
    redisConnection = new Redis({})

    await initializeContainer()
    server = startHttpServer()
  })

  afterAll((done) => {
    server.close(() => {
      redisConnection.disconnect()
      redisMemoryServer.stop().then(() => done())
    })
  })

  beforeEach(async () => {
    await redisConnection.del('*')
  })

  describe('GET /production-orders', () => {
    it('should return 200 and a list of production orders', async () => {
      const mockedProduct = new ProductionOrderProduct({ name: 'soda', quantity: 1 })
      const orders = [
        new ProductionOrder({ status: Status.PREPARING, totalPrice: 10, products: [mockedProduct] }),
        new ProductionOrder({ status: Status.READY, totalPrice: 10, products: [mockedProduct] })
      ]

      orders.forEach(async (order) => {
        await redisConnection.set(`production-order:${order.id}`, JSON.stringify(order))
      })

      const response = await request(server).get('/production-orders')
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveLength(orders.length)
    })
  })

  describe('PATCH /production-orders/:productionOrderId', () => {
    it('should return 200 and a list of production orders', async () => {
      const mockedProduct = new ProductionOrderProduct({ name: 'soda', quantity: 1 })
      const order = new ProductionOrder({ status: Status.PREPARING, totalPrice: 10, products: [mockedProduct] })

      await redisConnection.set(`production-order:${order.id}`, JSON.stringify(order))

      const response = await request(server).patch(`/production-orders/${order.id}`)
      console.log(response.body)
      expect(response.status).toBe(200)
    })
  })
})