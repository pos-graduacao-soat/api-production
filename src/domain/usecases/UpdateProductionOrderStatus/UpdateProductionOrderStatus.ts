import { inject, injectable } from 'tsyringe'
import { IUpdateProductionOrderStatusUseCase } from './IUpdateProductionOrderStatus'
import { UpdateProductionOrderStatusDTO } from './UpdateProductionOrderStatusDTO'
import { IProductionOrderRepository } from '../../ports/repositories/ProductionOrder'
import { UpdateOrderStatusProducer } from '../../../infra/amqp/producers/UpdateOrderStatusProducer'

@injectable()
export class UpdateProductionOrderStatusUseCase implements IUpdateProductionOrderStatusUseCase {
  constructor(
    @inject('IProductionOrderRepository')
    private readonly productionOrderRepository: IProductionOrderRepository,
    @inject('UpdateOrderStatusProducer')
    private readonly updateOrderStatusProducer: UpdateOrderStatusProducer
  ) { }

  async update(params: UpdateProductionOrderStatusDTO): Promise<void> {
    const { status, productionOrderId } = params

    await this.productionOrderRepository
      .updateStatus(productionOrderId, status)

    await this.updateOrderStatusProducer.publish(JSON.stringify({ id: productionOrderId, status }))
  }
}