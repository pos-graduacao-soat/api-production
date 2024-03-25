import 'reflect-metadata'
import { Status } from '../../../src/domain/entities/ProductionOrder'
import { Status as OrderStatus } from '../../../src/domain/valueObjects/Order'
import { IProductionOrderRepository } from '../../../src/domain/ports/repositories/ProductionOrder'
import { UpdateProductionOrderStatusUseCase } from '../../../src/domain/usecases/UpdateProductionOrderStatus/UpdateProductionOrderStatus'
import { UpdateOrderStatusProducer } from '../../../src/infra/amqp/producers/UpdateOrderStatusProducer'


describe('UpdateProductionOrderStatusUseCase', () => {
  let productionOrderRepository: jest.Mocked<IProductionOrderRepository>
  let orderStatusProducer: jest.Mocked<UpdateOrderStatusProducer>
  let updateProductionOrderStatusUseCase: UpdateProductionOrderStatusUseCase

  beforeEach(() => {
    productionOrderRepository = {
      updateStatus: jest.fn(),
    } as any

    orderStatusProducer = {
      publish: jest.fn(),
    } as any

    updateProductionOrderStatusUseCase = new UpdateProductionOrderStatusUseCase(productionOrderRepository, orderStatusProducer)
  })

  it('should update the production order status and order status', async () => {
    productionOrderRepository.updateStatus.mockResolvedValue()

    await updateProductionOrderStatusUseCase.update({ productionOrderId: '1', status: Status.READY })

    expect(productionOrderRepository.updateStatus).toHaveBeenCalledWith('1', Status.READY)
    expect(orderStatusProducer.publish).toHaveBeenCalled()
  })
})