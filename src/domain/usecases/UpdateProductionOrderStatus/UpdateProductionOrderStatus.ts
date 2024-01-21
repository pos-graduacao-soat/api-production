import { inject, injectable } from 'tsyringe'
import { IUpdateProductionOrderStatusUseCase } from './IUpdateProductionOrderStatus'
import { UpdateProductionOrderStatusDTO } from './UpdateProductionOrderStatusDTO'
import { IProductionOrderRepository } from '../../ports/repositories/ProductionOrder'
import { IOrderRepository } from '../../ports/repositories/Order'

@injectable()
export class UpdateProductionOrderStatusUseCase implements IUpdateProductionOrderStatusUseCase {
  constructor(
    @inject('IProductionOrderRepository')
    private readonly productionOrderRepository: IProductionOrderRepository,
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository
  ) { }

  async update(params: UpdateProductionOrderStatusDTO): Promise<void> {
    const { status, productionOrderId } = params

    await this.productionOrderRepository
      .updateStatus(productionOrderId, status)

    const isOrderUpdated = await this.orderRepository.updateStatus(productionOrderId, status)

    if (!isOrderUpdated) {
      throw new Error('Order not updated in orders service')
    }
  }
}