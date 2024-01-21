import { UpdateProductionOrderStatusDTO } from './UpdateProductionOrderStatusDTO'

export interface IUpdateProductionOrderStatusUseCase {
  update: (params: UpdateProductionOrderStatusDTO) => Promise<void>
}