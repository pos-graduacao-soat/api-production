import { ProductionOrder, Status } from '../../entities/ProductionOrder'

export interface IProductionOrderRepository {
  create: (filters: Partial<ProductionOrder>) => Promise<ProductionOrder>
  getById: (id: string) => Promise<ProductionOrder>
  list: (filters: Partial<ProductionOrder>) => Promise<ProductionOrder[]>
  updateStatus: (id: string, status: Status) => Promise<void>
  delete: (id: string) => Promise<void>
}