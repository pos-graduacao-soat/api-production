import 'reflect-metadata'
import { GetOpenProductionOrdersController } from '../../../src/presentation/controllers/GetOpenProductionOrdersController'
import { IGetOpenProductionOrdersUseCase } from '../../../src/domain/usecases/GetOpenProductionOrders/IGetOpenProductionOrders'
import { ProductionOrder, Status } from '../../../src/domain/entities/ProductionOrder'
import { IHttpRequest } from '../../../src/presentation/interfaces/IHttpRequest'

describe('GetOpenProductionOrdersController', () => {
  let getOpenProductionOrdersUseCase: jest.Mocked<IGetOpenProductionOrdersUseCase>
  let getOpenProductionOrdersController: GetOpenProductionOrdersController

  beforeEach(() => {
    getOpenProductionOrdersUseCase = {
      get: jest.fn()
    }
    getOpenProductionOrdersController = new GetOpenProductionOrdersController(getOpenProductionOrdersUseCase)
  })

  it('should get open production orders', async () => {
    const orders: ProductionOrder[] = [
      new ProductionOrder({ id: '1', status: Status.RECEIVED }),
      new ProductionOrder({ id: '2', status: Status.RECEIVED }),
    ]

    getOpenProductionOrdersUseCase.get.mockResolvedValue(orders)

    const mockedHttpRequestParams: IHttpRequest = {
      body: {},
      params: {},
      query: { status: Status.RECEIVED },
      headers: {},
      method: 'GET',
      url: ''
    }

    const httpResponse = await getOpenProductionOrdersController.handle(mockedHttpRequestParams)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toEqual(orders)
    expect(getOpenProductionOrdersUseCase.get).toHaveBeenCalledWith({ status: Status.RECEIVED })
  })
})