import 'reflect-metadata'
import { RedisMemoryServer } from 'redis-memory-server'
import { ProductionOrder, Status } from '../../../../src/domain/entities/ProductionOrder'
import { RedisProductionOrderRepository } from '../../../../src/infra/repositories/redis/ProductionOrder'
import { RedisClient } from '../../../../src/infra/database/RedisClient'

describe('RedisProductionOrderRepository', () => {
  let redisClient: RedisClient
  let redisProductionOrderRepository: RedisProductionOrderRepository
  let redisMemoryServer: RedisMemoryServer

  beforeAll(async () => {
    redisMemoryServer = new RedisMemoryServer({ instance: { port: 6379 } })
    await redisMemoryServer.start()
    redisClient = new RedisClient()
  })

  afterAll(async () => {
    await redisMemoryServer.stop()
  })

  beforeEach(() => {
    redisClient.del('*')
    redisProductionOrderRepository = new RedisProductionOrderRepository(redisClient)
  })

  it('should create a production order', async () => {
    const productionOrder = new ProductionOrder({ id: '1', status: Status.DONE })

    await redisProductionOrderRepository.create(productionOrder)

    const storedOrder = await redisProductionOrderRepository.getById('1')

    expect(storedOrder).toEqual(productionOrder)
  })

  it('should update the status of a production order', async () => {
    const productionOrder = new ProductionOrder({ id: '1', status: Status.READY })

    await redisProductionOrderRepository.create(productionOrder)

    await redisProductionOrderRepository.updateStatus('1', Status.DONE)

    const updatedOrder = await redisProductionOrderRepository.getById('1')

    expect(updatedOrder?.status).toEqual(Status.DONE)
  })

  it('should list production orders with a given status', async () => {
    const productionOrder1 = new ProductionOrder({ id: '1', status: Status.READY })
    const productionOrder2 = new ProductionOrder({ id: '2', status: Status.DONE })

    await redisProductionOrderRepository.create(productionOrder1)
    await redisProductionOrderRepository.create(productionOrder2)

    const orders = await redisProductionOrderRepository.list({ status: Status.READY })

    expect(orders).toEqual([productionOrder1])
  })

  it('should delete a production order', async () => {
    const productionOrder = new ProductionOrder({ id: '1', status: Status.READY })

    await redisProductionOrderRepository.create(productionOrder)

    await redisProductionOrderRepository.delete('1')

    const deletedOrder = await redisProductionOrderRepository.getById('1')

    expect(deletedOrder).toBeNull()
  })
})