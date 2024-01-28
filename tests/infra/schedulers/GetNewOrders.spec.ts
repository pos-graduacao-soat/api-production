import 'reflect-metadata'
import { GetNewOrdersScheduler } from '../../../src/infra/schedulers/GetNewOrders'
import { IGetNewOrdersUseCase } from '../../../src/domain/usecases/GetNewOrders/IGetNewOrders'

jest.useFakeTimers()

describe('GetNewOrdersScheduler', () => {
  let getNewOrdersUseCase: jest.Mocked<IGetNewOrdersUseCase>
  let getNewOrdersScheduler: GetNewOrdersScheduler

  beforeEach(() => {
    getNewOrdersUseCase = {
      execute: jest.fn(),
    } as any

    getNewOrdersScheduler = new GetNewOrdersScheduler(getNewOrdersUseCase)

    jest.spyOn(global, 'setInterval')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should start the scheduler and execute the use case every 10 seconds', async () => {
    await getNewOrdersScheduler.execute()

    expect(setInterval).toHaveBeenCalledTimes(1)
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 10000)

    jest.advanceTimersByTime(10000)

    expect(getNewOrdersUseCase.execute).toHaveBeenCalledTimes(1)

    jest.advanceTimersByTime(20000)

    expect(getNewOrdersUseCase.execute).toHaveBeenCalledTimes(3)
  })
})