import { container } from 'tsyringe'
import { RedisClient } from '../infra/database/RedisClient'
import { HttpOrderRepository } from '../infra/repositories/http/Order'
import { RedisProductionOrderRepository } from '../infra/repositories/redis/ProductionOrder'
import { GetOpenProductionOrdersUseCase } from '../domain/usecases/GetOpenProductionOrders/GetOpenProductionOrders'
import { HttpService } from '../infra/http/HttpService'
import { UpdateProductionOrderStatusUseCase } from '../domain/usecases/UpdateProductionOrderStatus/UpdateProductionOrderStatus'
import RabbitMQService from '../infra/amqp/RabbitMQService'
import { env } from './env'
import { CreateProductionOrderUseCase } from '../domain/usecases/CreateProductionOrder/CreateProductionOrder'
import { NewProductionOrderConsumer } from '../infra/amqp/consumers/NewProductionOrderConsumer'
import { UpdateOrderStatusProducer } from '../infra/amqp/producers/UpdateOrderStatusProducer'

export async function initializeContainer() {
  const rabbitMQService = new RabbitMQService(env.rabbitMQUrl)

  await rabbitMQService.connect()

  container.registerSingleton('RedisClient', RedisClient)

  container.registerInstance('HttpService', new HttpService({ validateStatus: () => true }))

  container.registerInstance('RabbitMQService', rabbitMQService)

  container.registerSingleton('NewProductionOrderConsumer', NewProductionOrderConsumer)

  container.registerSingleton('UpdateOrderStatusProducer', UpdateOrderStatusProducer)

  container.registerSingleton('IOrderRepository', HttpOrderRepository)
  container.registerSingleton('IProductionOrderRepository', RedisProductionOrderRepository)

  container.registerSingleton('IGetOpenProductionOrdersUseCase', GetOpenProductionOrdersUseCase)
  container.registerSingleton('IUpdateProductionOrderStatusUseCase', UpdateProductionOrderStatusUseCase)
  container.registerSingleton('ICreateProductionOrderUseCase', CreateProductionOrderUseCase)

}

export async function startConsumers() {
  const newProductionOrderConsumer = container.resolve<NewProductionOrderConsumer>('NewProductionOrderConsumer')
  newProductionOrderConsumer.consume().then(() => console.log('NewProductionOrderConsumer Consumer started'))
}