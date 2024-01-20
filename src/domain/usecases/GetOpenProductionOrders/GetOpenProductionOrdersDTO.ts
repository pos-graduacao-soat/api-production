import { Status } from '../../entities/ProductionOrder'

export interface GetOpenProductionOrdersDTO {
  status?: Status
}