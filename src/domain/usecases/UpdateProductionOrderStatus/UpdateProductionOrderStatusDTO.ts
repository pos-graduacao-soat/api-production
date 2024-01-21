import { Status } from '../../entities/ProductionOrder'

export interface UpdateProductionOrderStatusDTO {
  status: Status
  productionOrderId: string
}