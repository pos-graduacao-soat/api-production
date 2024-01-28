import 'reflect-metadata'
import { IProductionOrderRepository } from '../../../src/domain/ports/repositories/ProductionOrder'
import { GetOpenProductionOrdersUseCase } from '../../../src/domain/usecases/GetOpenProductionOrders/GetOpenProductionOrders'
import { ProductionOrder, Status } from '../../../src/domain/entities/ProductionOrder'

describe('GetOpenProductionOrdesUseCase', () => {
  let productionOrderRepository: jest.Mocked<IProductionOrderRepository>
  let getOpenProductionOrdersUseCase: GetOpenProductionOrdersUseCase

  beforeEach(() => {
    productionOrderRepository = {
      list: jest.fn(),
    } as any

    getOpenProductionOrdersUseCase = new GetOpenProductionOrdersUseCase(productionOrderRepository)
  })

  it('should fetch open production orders and sort them', async () => {
    const openOrders = [
      new ProductionOrder({ id: '1', status: Status.RECEIVED }),
      new ProductionOrder({ id: '2', status: Status.RECEIVED }),
    ]

    productionOrderRepository.list.mockResolvedValue(openOrders)

    const orders = await getOpenProductionOrdersUseCase.get({ status: Status.RECEIVED })

    expect(productionOrderRepository.list).toHaveBeenCalledWith({ status: Status.RECEIVED })
    expect(orders).toEqual(openOrders)
  })
})