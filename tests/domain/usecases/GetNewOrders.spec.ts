import 'reflect-metadata'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { IProductionOrderRepository } from '../../../src/domain/ports/repositories/ProductionOrder'
import { GetNewOrdersUseCase } from '../../../src/domain/usecases/GetNewOrders/GetNewOrders'
import { Order, Status } from '../../../src/domain/valueObjects/Order'

describe('GetNewOrdersUseCase', () => {
  let orderRepository: jest.Mocked<IOrderRepository>
  let productionOrderRepository: jest.Mocked<IProductionOrderRepository>
  let getNewOrdersUseCase: GetNewOrdersUseCase

  beforeEach(() => {
    orderRepository = {
      list: jest.fn(),
      updateStatus: jest.fn(),
    } as any

    productionOrderRepository = {
      create: jest.fn(),
    } as any

    getNewOrdersUseCase = new GetNewOrdersUseCase(orderRepository, productionOrderRepository)
  })

  it('should fetch new orders and create production orders', async () => {
    const newOrders = [
      new Order({ id: '1', totalPrice: 100, products: [], status: Status.SUCCESSFULPAYMENT }),
      new Order({ id: '2', totalPrice: 200, products: [{ id: '23', name: 'soda', price: 12, quantity: 1 }], status: Status.SUCCESSFULPAYMENT }),
    ]

    orderRepository.list.mockResolvedValue(newOrders)
    orderRepository.updateStatus.mockResolvedValue(true)
    productionOrderRepository.create.mockResolvedValue()

    await getNewOrdersUseCase.execute()

    expect(orderRepository.list).toHaveBeenCalledWith({ status: Status.SUCCESSFULPAYMENT })
    expect(orderRepository.updateStatus).toHaveBeenCalledTimes(newOrders.length)
    expect(productionOrderRepository.create).toHaveBeenCalledTimes(newOrders.length)
  })

  it('should throw an error if updating order status fails', async () => {
    const newOrders = [
      new Order({ id: '1', totalPrice: 100, products: [], status: Status.SUCCESSFULPAYMENT }),
    ]

    orderRepository.list.mockResolvedValue(newOrders)
    orderRepository.updateStatus.mockResolvedValue(false)

    await expect(getNewOrdersUseCase.execute()).rejects.toThrow('Error updating order status')
  })
})