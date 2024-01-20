import { ProductionOrder, Status } from '../../entities/ProductionOrder'

export interface IProductionOrderRepository {
  create: (productionOrder: ProductionOrder) => Promise<void>
  getById: (id: string) => Promise<ProductionOrder | null>
  list: (filters: Partial<ProductionOrder>) => Promise<ProductionOrder[]>
  updateStatus: (id: string, status: Status) => Promise<void>
  delete: (id: string) => Promise<void>
}