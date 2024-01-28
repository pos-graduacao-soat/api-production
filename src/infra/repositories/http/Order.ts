import { inject, injectable } from 'tsyringe'
import { Order, Status } from '../../../domain/valueObjects/Order'
import { IOrderRepository } from '../../../domain/ports/repositories/Order'
import { HttpService } from '../../http/HttpService'
import { env } from '../../../main/env'
import { IHttpResponseModel } from '../../http/interfaces/IHttpResponseModel'
import { OrderProduct } from '../../../domain/valueObjects/OrderProduct'

export interface GetOrderByIdResponseModel extends IHttpResponseModel {
  data: {
    id: string
    status: string
    totalPrice: number
    products: {
      id: string
      quantity: number
      name: string
      price: number
    }[]
  }
}

export interface ListOrdersResponseModel extends IHttpResponseModel {
  data: {
    id: string
    status: string
    totalPrice: number
    products: {
      id: string
      quantity: number
      name: string
      price: number
    }[]
  }[]
}

@injectable()
export class HttpOrderRepository implements IOrderRepository {
  baseUrl = env.ordersApiUrl

  constructor(
    @inject('HttpService') protected readonly httpService: HttpService
  ) { }

  async getById(id: string): Promise<Order | null> {
    const orderResponse = await this.httpService.get<GetOrderByIdResponseModel>(`${this.baseUrl}/orders/${id}`)

    if (orderResponse.status !== 200) return null

    const { data } = orderResponse

    return new Order({
      id: data.data.id,
      status: data.data.status as Status,
      totalPrice: data.data.totalPrice,
      products: data.data.products.map(product => {
        return new OrderProduct({
          id: product.id,
          quantity: product.quantity,
          name: product.name,
          price: product.price
        })
      })
    })
  }

  async updateStatus(id: string, status: Status): Promise<boolean> {
    const orderResponse = await this.httpService
      .patch<GetOrderByIdResponseModel>(`${this.baseUrl}/orders/${id}`, { status })

    if (orderResponse.status !== 200) return false

    return true
  }

  async list(filters: Partial<Order>): Promise<Order[]> {
    const queryParams = this.formatFilters(filters)

    const ordersResponse = await this.httpService
      .get<ListOrdersResponseModel>(`${this.baseUrl}/orders?${queryParams}`)

    if (ordersResponse.status !== 200) throw new Error(`Error fetching list of orders: ${ordersResponse.data.message}`)

    const { data } = ordersResponse

    return data.data.map(order => new Order({
      id: order.id,
      status: order.status as Status,
      totalPrice: order.totalPrice,
      products: order.products.map(product => {
        return new OrderProduct({
          id: product.id,
          quantity: product.quantity,
          name: product.name,
          price: product.price
        })
      })
    }))
  }

  private formatFilters(filters: Partial<Order>): string {
    return Object.entries(filters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
  }
}