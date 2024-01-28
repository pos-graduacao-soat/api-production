import 'reflect-metadata'
import { Status } from '../../../src/domain/entities/ProductionOrder'
import { Status as OrderStatus } from '../../../src/domain/valueObjects/Order'
import { IOrderRepository } from '../../../src/domain/ports/repositories/Order'
import { IProductionOrderRepository } from '../../../src/domain/ports/repositories/ProductionOrder'
import { UpdateProductionOrderStatusUseCase } from '../../../src/domain/usecases/UpdateProductionOrderStatus/UpdateProductionOrderStatus'


describe('UpdateProductionOrderStatusUseCase', () => {
  let productionOrderRepository: jest.Mocked<IProductionOrderRepository>
  let orderRepository: jest.Mocked<IOrderRepository>
  let updateProductionOrderStatusUseCase: UpdateProductionOrderStatusUseCase

  beforeEach(() => {
    productionOrderRepository = {
      updateStatus: jest.fn(),
    } as any

    orderRepository = {
      updateStatus: jest.fn(),
    } as any

    updateProductionOrderStatusUseCase = new UpdateProductionOrderStatusUseCase(productionOrderRepository, orderRepository)
  })

  it('should update the production order status and order status', async () => {
    productionOrderRepository.updateStatus.mockResolvedValue()
    orderRepository.updateStatus.mockResolvedValue(true)

    await updateProductionOrderStatusUseCase.update({ productionOrderId: '1', status: Status.READY })

    expect(productionOrderRepository.updateStatus).toHaveBeenCalledWith('1', Status.READY)
    expect(orderRepository.updateStatus).toHaveBeenCalledWith('1', OrderStatus.READY)
  })

  it('should throw an error if updating order status fails', async () => {
    productionOrderRepository.updateStatus.mockResolvedValue()
    orderRepository.updateStatus.mockResolvedValue(false)

    await expect(updateProductionOrderStatusUseCase.update({ productionOrderId: '1', status: Status.READY })).rejects.toThrow('Order not updated in orders service')
  })
})