import { Order, Status } from '../../valueObjects/Order'

export interface IOrderRepository {
  list: (filters: Partial<Order>) => Promise<Order[]>
  updateStatus: (id: string, status: Status) => Promise<boolean>
}