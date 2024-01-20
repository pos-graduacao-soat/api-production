import { container } from 'tsyringe'
import { RedisClient } from '../infra/database/RedisClient'
import { HttpOrderRepository } from '../infra/repositories/http/Order'
import { RedisProductionOrderRepository } from '../infra/repositories/redis/ProductionOrder'
import { GetOpenProductionOrdersUseCase } from '../domain/usecases/GetOpenProductionOrders/GetOpenProductionOrders'

export async function initializeContainer() {
  container.registerSingleton('RedisClient', RedisClient)

  container.registerSingleton('IOrderRepository', HttpOrderRepository)
  container.registerSingleton('IProductionOrderRepository', RedisProductionOrderRepository)

  container.registerSingleton('IGetOpenProductionOrdersUseCase', GetOpenProductionOrdersUseCase)
}