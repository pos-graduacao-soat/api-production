import { container } from 'tsyringe'
import { RedisClient } from '../infra/database/RedisClient'
import { HttpOrderRepository } from '../infra/repositories/http/Order'
import { RedisProductionOrderRepository } from '../infra/repositories/redis/ProductionOrder'
import { GetOpenProductionOrdersUseCase } from '../domain/usecases/GetOpenProductionOrders/GetOpenProductionOrders'
import { GetNewOrdersUseCase } from '../domain/usecases/GetNewOrders/GetNewOrders'
import { GetNewOrdersScheduler } from '../infra/schedulers/GetNewOrders'
import { HttpService } from '../infra/http/HttpService'

export async function initializeContainer() {
  container.registerSingleton('RedisClient', RedisClient)

  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))

  container.registerSingleton('IOrderRepository', HttpOrderRepository)
  container.registerSingleton('IProductionOrderRepository', RedisProductionOrderRepository)

  container.registerSingleton('IGetOpenProductionOrdersUseCase', GetOpenProductionOrdersUseCase)
  container.registerSingleton('IGetNewOrdersUseCase', GetNewOrdersUseCase)

  container.registerSingleton('GetNewOrdersScheduler', GetNewOrdersScheduler)
}