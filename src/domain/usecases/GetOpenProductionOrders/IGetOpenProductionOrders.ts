import { ProductionOrder } from '../../entities/ProductionOrder'
import { GetOpenProductionOrdersDTO } from './GetOpenProductionOrdersDTO'

export interface IGetOpenProductionOrdersUseCase {
  get: (params: GetOpenProductionOrdersDTO) => Promise<ProductionOrder[]>
}