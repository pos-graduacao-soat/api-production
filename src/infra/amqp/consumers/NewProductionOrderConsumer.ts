import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'
import { CreateProductionOrderUseCase } from '../../../domain/usecases/CreateProductionOrder/CreateProductionOrder'

@injectable()
export class NewProductionOrderConsumer {
  queue = 'start-production-order'

  constructor(
    @inject('RabbitMQService')
    private rabbitMQService: RabbitMQService,
    @inject('ICreateProductionOrderUseCase')
    private createProductionOrderUseCase: CreateProductionOrderUseCase
  ) { }

  async consume(): Promise<void> {
    await this.rabbitMQService.consume(this.queue, async (message) => {
      if (message) {
        const orderData = JSON.parse(message.content.toString())

        if (!orderData.order) {
          await this.rabbitMQService.nack(message)
          return
        }

        console.log(`[PaymentStatusUpdateConsumer] Consumed message with orderId: ${orderData.order.id} and status: ${orderData.order.status}`)

        await this.createProductionOrderUseCase.execute(orderData)

        await this.rabbitMQService.ack(message)
      }
    })
  }
}