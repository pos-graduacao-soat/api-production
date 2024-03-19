import { inject, injectable } from 'tsyringe'
import RabbitMQService from '../RabbitMQService'

@injectable()
export class UpdateOrderStatusProducer {
  exchange = 'orders'
  routingKey = 'update-order-status'

  constructor(
    @inject('RabbitMQService')
    private readonly rabbitMQService: RabbitMQService
  ) { }

  async publish(message: string): Promise<void> {
    return this.rabbitMQService.publish(this.exchange, this.routingKey, message)
  }
}