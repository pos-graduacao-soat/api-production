import 'reflect-metadata'
import { Order, Status } from '../../../../src/domain/valueObjects/Order'
import { HttpOrderRepository } from '../../../../src/infra/repositories/http/Order'
import { HttpService } from '../../../../src/infra/http/HttpService'

jest.mock('../../../../src/infra/http/HttpService')

describe('HttpOrderRepository', () => {
  let httpService: jest.Mocked<HttpService>
  let httpOrderRepository: HttpOrderRepository

  beforeEach(() => {
    httpService = new HttpService() as jest.Mocked<HttpService>
    httpOrderRepository = new HttpOrderRepository(httpService)
  })

  describe('getById', () => {
    it('should get an order by id', async () => {
      const order = new Order({
        id: '1',
        status: Status.WAITINGPAYMENT,
        totalPrice: 100,
        products: [{ id: '1', name: 'product', price: 100, quantity: 1 }]
      })

      httpService.get.mockResolvedValue({
        status: 200,
        data: { data: order }
      } as any)

      const result = await httpOrderRepository.getById('1')

      expect(result).toEqual(order)
      expect(httpService.get).toHaveBeenCalledWith('/orders/1')
    })

    it('should return null if status is not 200', async () => {
      httpService.get.mockResolvedValue({
        status: 500,
        data: { data: {} }
      } as any)

      const result = await httpOrderRepository.getById('1')

      expect(httpService.get).toHaveBeenCalledWith('/orders/1')
      expect(result).toBeNull()
    })
  })

  describe('updateStatus', () => {
    it('should update the status of an order', async () => {
      httpService.patch.mockResolvedValue({
        status: 200,
        data: { statusCode: 200, body: {} }
      } as any)

      const result = await httpOrderRepository.updateStatus('1', Status.DONE)

      expect(result).toBe(true)
      expect(httpService.patch).toHaveBeenCalledWith('/orders/1', { status: Status.DONE })
    })

    it('should return false if request status is not 200', async () => {
      httpService.patch.mockResolvedValue({
        status: 400,
        data: { statusCode: 400, body: {} }
      } as any)

      const result = await httpOrderRepository.updateStatus('1', Status.DONE)

      expect(result).toBe(false)
      expect(httpService.patch).toHaveBeenCalledWith('/orders/1', { status: Status.DONE })
    })
  })

  describe('list', () => {
    it('should list orders with given filters', async () => {
      const order = new Order({
        id: '1',
        status: Status.DONE,
        totalPrice: 100,
        products: [{ id: '1', name: 'product', price: 100, quantity: 1 }]
      })

      httpService.get.mockResolvedValue({
        status: 200,
        data: { data: [order] }
      } as any)

      const result = await httpOrderRepository.list({ status: Status.DONE })

      expect(result).toEqual([order])
      expect(httpService.get).toHaveBeenCalledWith('/orders?status=DONE')
    })

    it('should throw an error if request status is not 200', async () => {
      httpService.get.mockResolvedValue({
        status: 500,
        data: { data: [] }
      } as any)

      await expect(httpOrderRepository.list({ status: Status.DONE })).rejects.toThrow()
      expect(httpService.get).toHaveBeenCalledWith('/orders?status=DONE')
    })
  })
})