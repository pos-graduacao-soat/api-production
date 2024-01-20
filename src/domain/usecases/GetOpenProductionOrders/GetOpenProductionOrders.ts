import { inject, injectable } from 'tsyringe'
import { IGetOpenProductionOrdersUseCase } from './IGetOpenProductionOrders'
import { GetOpenProductionOrdersDTO } from './GetOpenProductionOrdersDTO'
import { ProductionOrder } from '../../entities/ProductionOrder'
import { IProductionOrderRepository } from '../../ports/repositories/ProductionOrder'

@injectable()
export class GetOpenProductionOrdersUseCase implements IGetOpenProductionOrdersUseCase {
  constructor(
    @inject('IProductionOrderRepository')
    private readonly productionOrderRepository: IProductionOrderRepository
  ) { }

  async get(params: GetOpenProductionOrdersDTO): Promise<ProductionOrder[]> {
    const { status } = params

    const productionOrders = await this.productionOrderRepository.list({
      status
    })

    const sortedOrders = this.sortOrders(productionOrders)

    return sortedOrders
  }

  private sortOrders(productionOrders: ProductionOrder[]): ProductionOrder[] {
    return productionOrders
  }
}