import 'reflect-metadata'
import { UpdateProductionOrderController } from '../../../src/presentation/controllers/UpdateProductionOrderStatusController'
import { IUpdateProductionOrderStatusUseCase } from '../../../src/domain/usecases/UpdateProductionOrderStatus/IUpdateProductionOrderStatus'
import { Status } from '../../../src/domain/entities/ProductionOrder'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'

describe('UpdateProductionOrderController', () => {
  let updateProductionOrderStatusUseCaseMock: jest.Mocked<IUpdateProductionOrderStatusUseCase>
  let controller: UpdateProductionOrderController

  beforeEach(() => {
    jest.clearAllMocks()
    updateProductionOrderStatusUseCaseMock = {
      update: jest.fn().mockResolvedValue({}),
    }

    controller = new UpdateProductionOrderController(updateProductionOrderStatusUseCaseMock)
  })

  const mockedHttpRequestParams: IHttpRequest = {
    body: {
      status: Status.DONE
    },
    params: {
      productionOrderId: '123'
    },
    query: {},
    headers: {},
    method: 'GET',
    url: ''
  }

  it('should return ok if update is done', async () => {
    updateProductionOrderStatusUseCaseMock.update.mockResolvedValue()

    const result = await controller.handle(mockedHttpRequestParams)

    expect(result.statusCode).toBe(200)
    expect(updateProductionOrderStatusUseCaseMock.update).toHaveBeenCalledWith({ status: Status.DONE, productionOrderId: '123' })
  })
})