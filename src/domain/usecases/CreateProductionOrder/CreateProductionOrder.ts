import { inject, injectable } from 'tsyringe'
import { ICreateProductionOrderUseCase } from './ICreateProductionOrder'
import { IProductionOrderRepository } from '../../ports/repositories/ProductionOrder'
import { ProductionOrder, Status as ProductionOrderStatus } from '../../entities/ProductionOrder'
import { ProductionOrderProduct } from '../../entities/ProductionOrderProduct'
import { CreateProductionOrderDTO } from './CreateProductionOrderDTO'
import { UpdateOrderStatusProducer } from '../../../infra/amqp/producers/UpdateOrderStatusProducer'

@injectable()
export class CreateProductionOrderUseCase implements ICreateProductionOrderUseCase {
  constructor(
    @inject('IProductionOrderRepository')
    private readonly productionOrderRepository: IProductionOrderRepository,
    @inject('UpdateOrderStatusProducer')
    private readonly updateOrderStatusProducer: UpdateOrderStatusProducer
  ) { }

  async execute(params: CreateProductionOrderDTO): Promise<void> {
    const { order } = params

    const productionOrder = new ProductionOrder({
      id: order.id,
      totalPrice: order.totalPrice,
      products: this.formatProducts(order.products),
      status: ProductionOrderStatus.RECEIVED
    })

    await this.productionOrderRepository.create(productionOrder)
    await this.updateOrderStatusProducer.publish(JSON.stringify({ id: order.id, status: productionOrder.status }))

  }

  private formatProducts(products: CreateProductionOrderDTO['order']['products']): ProductionOrderProduct[] {
    return products.map(product => {
      return new ProductionOrderProduct({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
      })
    })
  }
}