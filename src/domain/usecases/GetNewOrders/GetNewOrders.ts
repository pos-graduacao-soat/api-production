import { inject, injectable } from 'tsyringe'
import { IGetNewOrdersUseCase } from './IGetNewOrders'
import { IOrderRepository } from '../../ports/repositories/Order'
import { Order, Status } from '../../valueObjects/Order'
import { IProductionOrderRepository } from '../../ports/repositories/ProductionOrder'
import { ProductionOrder, Status as ProductionOrderStatus } from '../../entities/ProductionOrder'
import { ProductionOrderProduct } from '../../entities/ProductionOrderProduct'

@injectable()
export class GetNewOrdersUseCase implements IGetNewOrdersUseCase {
  constructor(
    @inject('IOrderRepository')
    private readonly orderRepository: IOrderRepository,
    @inject('IProductionOrderRepository')
    private readonly productionOrderRepository: IProductionOrderRepository
  ) { }

  async execute(): Promise<void> {
    console.log('[GetNewOrdersUseCase] Fetching new orders...')

    const newOrders = await this.orderRepository.list({
      status: Status.SUCCESSFULPAYMENT
    })

    console.log(`[GetNewOrdersUseCase] New orders found: ${newOrders.length}`)

    for (const order of newOrders) {
      await Promise.all([
        this.createNewProductionOrder(order),
        this.updateOrderStatus(order.id)
      ])
    }
  }

  private async createNewProductionOrder(order: Order): Promise<void> {
    const productionOrder = new ProductionOrder({
      id: order.id,
      totalPrice: order.totalPrice,
      products: order.products.map(product => {
        return new ProductionOrderProduct({
          id: product.id,
          name: product.name,
          quantity: product.quantity,
        })
      }),
      status: ProductionOrderStatus.RECEIVED
    })

    await this.productionOrderRepository.create(productionOrder)
  }

  private async updateOrderStatus(orderId: string): Promise<void> {
    console.log(`[GetNewOrdersUseCase] Updating status for order: ${orderId}`)

    const isUpdated = await this.orderRepository.updateStatus(orderId, Status.RECEIVED)

    if (!isUpdated) throw new Error('Error updating order status')
  }
}